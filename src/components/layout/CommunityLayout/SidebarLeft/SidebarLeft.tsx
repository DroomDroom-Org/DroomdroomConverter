import React, { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	faBell,
	faFileLines,
	faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
	faUser as faUserBold,
	faBell as faBellBold,
	faFileLines as faFileLinesBold,
} from '@fortawesome/free-solid-svg-icons';
import { faEllipsis, faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
	SidebarLeftWrapper,
	StickyWrapper,
	StyledLink,
	ImageWrapper,
} from './SidebarLeft.styled';
import { useAppDispatch } from 'hooks/redux';
import { changeAuthOpen } from 'app/slices/menuSlice';

const SidebarLeft = () => {
	const { data: session } = useSession();
	const { pathname } = useRouter();
	const dispatch = useAppDispatch();
	const username = session?.user.name;

	const iconProps = {
		fontSize: 20,
		width: 20,
		height: 20,
	};

	const handleSignupOpen = (event: MouseEvent) => {
		event.preventDefault();
		dispatch(changeAuthOpen('signup'));
	};

	return (
		<SidebarLeftWrapper>
			<StickyWrapper>
				<Link href="/community">
					<a>
						<ImageWrapper>
							<Image
								src="/static/community.svg"
								alt=""
								width={208}
								height={25}
							/>
						</ImageWrapper>
					</a>
				</Link>
				<ul>
					<li>
						<Link href="/community" passHref>
							<StyledLink active={pathname === '/community'}>
								<FontAwesomeIcon icon={faRss} {...iconProps} />
								Feed
							</StyledLink>
						</Link>
					</li>
					<li>
						<Link href="/community" passHref>
							<StyledLink>
								<FontAwesomeIcon
									icon={
										pathname === '/community/articles'
											? faFileLinesBold
											: faFileLines
									}
									{...iconProps}
								/>
								Articles
							</StyledLink>
						</Link>
					</li>
					<li>
						<Link href="/community" passHref>
							<StyledLink>
								<FontAwesomeIcon
									icon={
										pathname === '/community/notifications'
											? faBellBold
											: faBell
									}
									{...iconProps}
								/>
								Notifications
							</StyledLink>
						</Link>
					</li>
					<li>
						<Link
							href={`/community/profile/${username ? username : ''}`}
							passHref
						>
							<StyledLink
								onClick={!session ? handleSignupOpen : undefined}
								active={
									pathname === '/community/profile/[name]' ||
									pathname === '/community/edit-profile'
								}
							>
								<FontAwesomeIcon
									icon={
										pathname === '/community/profile/[name]' ||
										pathname === '/community/edit-profile'
											? faUserBold
											: faUser
									}
									{...iconProps}
								/>
								Profile
							</StyledLink>
						</Link>
					</li>
					<li>
						<Link href="" passHref>
							<StyledLink>
								<FontAwesomeIcon icon={faEllipsis} {...iconProps} />
								More
							</StyledLink>
						</Link>
					</li>
				</ul>
			</StickyWrapper>
		</SidebarLeftWrapper>
	);
};

export default SidebarLeft;
