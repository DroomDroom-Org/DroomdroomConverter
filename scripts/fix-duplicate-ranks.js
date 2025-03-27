const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDuplicateRanks() {
  console.log('Starting duplicate rank fix process...');
  
  try {
    // 1. Get all tokens with their ranks
    console.log('Fetching all tokens...');
    const allTokens = await prisma.token.findMany({
      select: {
        id: true,
        ticker: true,
        name: true,
        rank: true,
        currentPrice: {
          select: {
            lastUpdated: true
          }
        }
      },
      orderBy: {
        rank: 'asc'
      }
    });
    
    console.log(`Found ${allTokens.length} total tokens`);
    
    // 2. Find duplicate ranks
    const rankMap = new Map();
    const duplicates = [];
    
    allTokens.forEach(token => {
      if (token.rank === null) return; // Skip tokens without rank
      
      if (!rankMap.has(token.rank)) {
        rankMap.set(token.rank, [token]);
      } else {
        rankMap.get(token.rank).push(token);
      }
    });
    
    // Identify tokens with duplicate ranks
    for (const [rank, tokens] of rankMap.entries()) {
      if (tokens.length > 1) {
        console.log(`Found ${tokens.length} tokens with rank ${rank}`);
        
        // Sort by last updated date (most recent first)
        tokens.sort((a, b) => {
          const dateA = a.currentPrice?.lastUpdated || new Date(0);
          const dateB = b.currentPrice?.lastUpdated || new Date(0);
          return dateB - dateA;
        });
        
        // Keep the most recently updated token, add others to duplicates list
        const [keepToken, ...dupeTokens] = tokens;
        console.log(`Keeping ${keepToken.name} (${keepToken.ticker}) at rank ${rank}`);
        
        dupeTokens.forEach(token => {
          duplicates.push(token);
          console.log(`Marked ${token.name} (${token.ticker}) as duplicate at rank ${rank}`);
        });
      }
    }
    
    console.log(`Found ${duplicates.length} tokens with duplicate ranks to be reassigned`);
    
    if (duplicates.length === 0) {
      console.log('No duplicate ranks found. Exiting.');
      return;
    }

    console.log("Found duplicates", duplicates);
    process.exit(0);
    
    // 3. Find the highest current rank
    const highestRank = Math.max(...allTokens.map(t => t.rank || 0));
    console.log(`Highest current rank is ${highestRank}`);
    
    // 4. Find empty spots from 5001 to highestRank
    const existingRanks = new Set(allTokens.map(t => t.rank).filter(r => r !== null));
    const emptySpots = [];
    
    // Start checking from 5001
    for (let i = 5001; i <= highestRank; i++) {
      if (!existingRanks.has(i)) {
        emptySpots.push(i);
      }
    }
    
    console.log(`Found ${emptySpots.length} empty spots between 5001 and ${highestRank}`);
    
    // 5. Reassign ranks for duplicates
    const updates = [];
    let nextRank = highestRank + 1;
    
    for (let i = 0; i < duplicates.length; i++) {
      const token = duplicates[i];
      let newRank;
      
      if (i < emptySpots.length) {
        // Use an empty spot if available
        newRank = emptySpots[i];
      } else {
        // Otherwise append to the end
        newRank = nextRank++;
      }
      
      updates.push({
        tokenId: token.id,
        oldRank: token.rank,
        newRank: newRank
      });
      
      console.log(`Will reassign ${token.name} (${token.ticker}) from rank ${token.rank} to ${newRank}`);
    }
    
    // 6. Perform updates in batches
    console.log('Performing rank updates...');
    
    for (const update of updates) {
      await prisma.token.update({
        where: { id: update.tokenId },
        data: { rank: update.newRank }
      });
      console.log(`Updated token ${update.tokenId} from rank ${update.oldRank} to ${update.newRank}`);
    }
    
    console.log('Successfully reassigned all duplicate ranks.');
    
  } catch (error) {
    console.error('Error fixing duplicate ranks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function if this script is called directly
if (require.main === module) {
  fixDuplicateRanks()
    .then(() => console.log('Rank fix process completed'))
    .catch(e => console.error('Error in rank fix process:', e));
}

module.exports = { fixDuplicateRanks }; 