import axios from 'axios';
import HomeTable from 'components/pages/home/HomeTable/HomeTable';
import Pagination from 'components/Pagination/Pagination';
import SEO from 'components/SEO/SEO';
import { capitalize } from 'lodash';
import type { GetServerSideProps, NextPage } from 'next';
import { CoinData } from 'pages/converter';

interface CategoryProps {
	coins: CoinData[];
	category: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const res = await axios.get(`${process.env.API_URL}/coins/markets`, {
		params: {
			vs_currency: 'usd',
			order: 'market_cap_desc',
			per_page: 100,
			category: query.slug,
			sparkline: 'true',
			page: query.page ?? 1,
			price_change_percentage: '1h,24h,7d',
		},
	});

	return {
		props: {
			coins: res.data,
			category: query.slug,
		},
	};
};

const Category: NextPage<CategoryProps> = ({ coins, category }) => {
	return (
		<>
			<SEO
				title={`Top ${capitalize(
					category
				)} Tokens by Market Capitalization | CoinMarketCap`}
				description={`See today's latest prices of ${capitalize(
					category
				)} crypto tokens listed by market capitalization ✔️ 24h volume ✔️ 24h price change ✔️`}
			/>
			<HomeTable initialCoins={coins} />
			<Pagination
				totalItems={4400}
				itemsPerPage={100}
				uri={`/categories/${category}`}
			/>
		</>
	);
};

export default Category;
