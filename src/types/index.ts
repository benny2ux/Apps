export type GifterBadgeColor = 'blue' | 'gold' | 'red' | 'purple';

export type CreatorLeague = 'D2' | 'D1' | 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';

export type FanClubRole = 'Member' | 'Superfan' | 'Guardian';

export interface LeagueFragments {
  blue: number;   // D leagues
  red: number;    // C leagues
  gold: number;   // B leagues
  purple: number; // A leagues
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  dob: string;
  ageVerified: boolean;
  isVerified: boolean; // Blue verification badge
  followersCount: number;
  followingCount: number;
  likesReceivedCount: number;
  postsCount: number;
  
  // Gifter 1-50
  gifterLevel: number;
  gifterXp: number;
  
  // Enigma
  isEnigmaEligible: boolean; // Level 25+
  isEnigmaPurchased: boolean;
  isEnigmaActive: boolean;
  
  // Creator League
  creatorLeague: CreatorLeague;
  leagueCoinsReceived: number;
  leagueTargetCoins: number;
  leagueChallengeExpiresAt: number; // 48h timestamp
  leagueFragments: LeagueFragments;
  
  // Fan Club info
  fanClub?: {
    creatorId: string;
    creatorName: string;
    role: FanClubRole;
    points: number;
    level: number;
    joinedAt: string;
  };
  
  // Financial Wallets
  walletCoins: number;
  creatorEarningsKsh: number;
  creatorPendingKsh: number;
  
  // Safety & Moderation
  liveStrikes: number; // 0, 1, 2, 3
  isLiveSuspended: boolean;
  liveSuspensionExpiresAt?: number;
  isAccountSuspended: boolean;
  blockedUserIds: string[];
  
  role: 'user' | 'admin' | 'moderator';
}

export interface Post {
  id: string;
  userId: string;
  author: User;
  type: 'photo' | 'video';
  mediaUrl: string;
  caption: string;
  tags: string[];
  musicTitle?: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  sharesCount: number;
  giftsTotalCoins: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  isReposted: boolean;
  isGiftEligible: boolean;
  violationStatus?: 'clean' | 'under_review' | 'restricted';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: User;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Story {
  id: string;
  userId: string;
  author: User;
  mediaUrl: string;
  type: 'photo' | 'video';
  caption?: string;
  filterApplied?: string;
  createdAt: number;
  expiresAt: number;
  hasViewed?: boolean;
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  coins: number;
  tier: 'ordinary' | 'animated' | 'premium' | 'special';
  animationType: 'rose_rain' | 'heart_burst' | 'disco_lights' | 'neon_crown' | 'supercar' | 'dragon_flight' | 'rocket_launch' | 'lion_roar' | 'timeup_crown';
  description: string;
}

export interface LiveGuest {
  position: number; // 1 to 9
  userId: string;
  user: User;
  isCameraOn: boolean;
  isMicOn: boolean;
  isMutedByHost: boolean;
  cameraDisabledByHost: boolean;
  coinsEarnedInLive: number;
}

export interface LiveRoom {
  id: string;
  hostId: string;
  host: User;
  title: string;
  topic: string;
  viewerCount: number;
  status: 'live' | 'ended';
  guests: LiveGuest[]; // up to 9
  totalGiftsReceived: number;
  activeAnnouncement?: {
    username: string;
    level: number;
    badgeColor: GifterBadgeColor;
    isEnigma: boolean;
    timestamp: number;
  };
  currentSoundEffect?: {
    name: string;
    timestamp: number;
  };
  pkBattle?: {
    isActive: boolean;
    opponentId: string;
    opponentName: string;
    opponentAvatar: string;
    hostPoints: number;
    opponentPoints: number;
    timeLeftSeconds: number;
  };
  strikes: number;
}

export interface LiveComment {
  id: string;
  roomId: string;
  userId: string;
  user: User;
  text: string;
  timestamp: number;
  isGiftNotice?: boolean;
  giftName?: string;
  giftCoins?: number;
  isEnigma?: boolean;
}

export interface CoinPackage {
  id: string;
  priceKsh: number;
  coins: number;
  popular?: boolean;
  bonus?: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  type: 'recharge' | 'gift_sent' | 'gift_received' | 'enigma_purchase' | 'fanclub_join' | 'withdrawal';
  amountCoins?: number;
  amountKsh?: number;
  description: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  user: User;
  amountKsh: number;
  method: 'M-Pesa' | 'Bank' | 'PayPal';
  accountDetails: string;
  requestedAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedPostId?: string;
  reportedRoomId?: string;
  reason: string;
  details: string;
  status: 'pending' | 'actioned' | 'dismissed';
  timestamp: number;
}

export interface ViolationAppeal {
  id: string;
  userId: string;
  username: string;
  strikeNumber: number;
  violationReason: string;
  appealExplanation: string;
  evidenceNotes: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  reviewedBy?: string;
}

export interface AdminAuditLog {
  id: string;
  adminUsername: string;
  action: string;
  target: string;
  details: string;
  timestamp: number;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'gift' | 'live_invite' | 'fan_club' | 'security_alert';
  fromUser?: User;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  targetId?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  read: boolean;
}
