import {
  User,
  Post,
  Comment,
  Story,
  VirtualGift,
  LiveRoom,
  LiveComment,
  CoinPackage,
  CoinTransaction,
  WithdrawalRequest,
  ModerationReport,
  ViolationAppeal,
  AdminAuditLog,
  NotificationItem,
  DirectMessage,
  GifterBadgeColor,
  CreatorLeague
} from '../types';

export const GIFTS_CATALOG: VirtualGift[] = [
  {
    id: 'gift_rose',
    name: 'Rose',
    icon: '🌹',
    coins: 1,
    tier: 'ordinary',
    animationType: 'rose_rain',
    description: 'A classic gesture of appreciation.'
  },
  {
    id: 'gift_heart',
    name: 'Love Heart',
    icon: '💖',
    coins: 5,
    tier: 'ordinary',
    animationType: 'heart_burst',
    description: 'Shower the creator with radiant love.'
  },
  {
    id: 'gift_icecream',
    name: 'Sweet Treat',
    icon: '🍦',
    coins: 10,
    tier: 'ordinary',
    animationType: 'heart_burst',
    description: 'A delicious burst of sweetness.'
  },
  {
    id: 'gift_disco',
    name: 'Disco Ball',
    icon: '🪩',
    coins: 99,
    tier: 'animated',
    animationType: 'disco_lights',
    description: 'Lights up the entire LIVE room screen!'
  },
  {
    id: 'gift_crown',
    name: 'Neon Crown',
    icon: '👑',
    coins: 299,
    tier: 'animated',
    animationType: 'neon_crown',
    description: 'Crown your favorite creator as royalty.'
  },
  {
    id: 'gift_supercar',
    name: 'Supercar',
    icon: '🏎️',
    coins: 500,
    tier: 'animated',
    animationType: 'supercar',
    description: 'Speed into the room with burning tires!'
  },
  {
    id: 'gift_dragon',
    name: 'Neon Dragon',
    icon: '🐉',
    coins: 1000,
    tier: 'premium',
    animationType: 'dragon_flight',
    description: 'A mythical glowing dragon flying over the screen.'
  },
  {
    id: 'gift_rocket',
    name: 'Galaxy Rocket',
    icon: '🚀',
    coins: 2500,
    tier: 'premium',
    animationType: 'rocket_launch',
    description: 'Launches into the cosmos with stardust trails.'
  },
  {
    id: 'gift_timeup_crown',
    name: 'TIME UP Imperial Crown',
    icon: '💎',
    coins: 5000,
    tier: 'special',
    animationType: 'timeup_crown',
    description: 'The supreme TIME UP emblem of prestige.'
  },
  {
    id: 'gift_lion',
    name: 'Golden Lion King',
    icon: '🦁',
    coins: 10000,
    tier: 'special',
    animationType: 'lion_roar',
    description: 'Legendary roar heard across all connected rooms.'
  }
];

export const COIN_PACKAGES: CoinPackage[] = [
  { id: 'pkg_100', priceKsh: 100, coins: 100, bonus: 'Basic' },
  { id: 'pkg_250', priceKsh: 250, coins: 260, bonus: '+10 Bonus Coins', popular: true },
  { id: 'pkg_500', priceKsh: 500, coins: 525, bonus: '+25 Bonus Coins' },
  { id: 'pkg_1000', priceKsh: 1000, coins: 1080, bonus: '+80 Bonus Coins' },
  { id: 'pkg_2500', priceKsh: 2500, coins: 2750, bonus: '+250 Bonus Coins' },
  { id: 'pkg_5000', priceKsh: 5000, coins: 5600, bonus: '+600 Bonus Coins', popular: true }
];

export function getGifterBadgeColor(level: number): GifterBadgeColor {
  if (level >= 45) return 'purple';
  if (level >= 30) return 'red';
  if (level >= 15) return 'gold';
  return 'blue';
}

export function getDiamondFragmentsCount(level: number): number {
  // A new fragment every 5 levels up to 10 at level 50
  return Math.min(10, Math.max(1, Math.floor(level / 5) + 1));
}

export function getCoinsForNextLevel(level: number): number {
  return level * 400 + Math.floor(Math.pow(level, 1.8) * 50);
}

const SEED_USERS: User[] = [
  {
    id: 'user_current',
    username: 'Queen_Star',
    displayName: 'Queen Star',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: '✨ Singer, Host & VIP Diamond Gifter 💎 | Rise to the top! #TimeUpOfficial',
    dob: '1998-04-12',
    ageVerified: true,
    isVerified: true,
    followersCount: 142800,
    followingCount: 384,
    likesReceivedCount: 924500,
    postsCount: 38,
    gifterLevel: 28, // Eligible for VIP join + Enigma!
    gifterXp: 48900,
    isEnigmaEligible: true,
    isEnigmaPurchased: true,
    isEnigmaActive: false,
    creatorLeague: 'A2',
    leagueCoinsReceived: 620000,
    leagueTargetCoins: 1000000,
    leagueChallengeExpiresAt: Date.now() + 36 * 3600 * 1000,
    leagueFragments: { blue: 4, red: 3, gold: 3, purple: 2 },
    fanClub: {
      creatorId: 'user_apex',
      creatorName: 'Apex Nairobi',
      role: 'Guardian',
      points: 2450,
      level: 7,
      joinedAt: '2026-08-15'
    },
    walletCoins: 8450,
    creatorEarningsKsh: 28400,
    creatorPendingKsh: 1200,
    liveStrikes: 0,
    isLiveSuspended: false,
    isAccountSuspended: false,
    blockedUserIds: [],
    role: 'admin' // Can test admin dashboard seamlessly
  },
  {
    id: 'user_apex',
    username: 'Apex_Live',
    displayName: 'Apex Host 🇰🇪',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: '🔥 Top 1 A1 League Host | Nairobi Beats & Live Lounge | 10-Guest Party every evening! 👑',
    dob: '1995-11-20',
    ageVerified: true,
    isVerified: true,
    followersCount: 890400,
    followingCount: 420,
    likesReceivedCount: 3890000,
    postsCount: 112,
    gifterLevel: 42,
    gifterXp: 184000,
    isEnigmaEligible: true,
    isEnigmaPurchased: true,
    isEnigmaActive: false,
    creatorLeague: 'A1',
    leagueCoinsReceived: 1450000,
    leagueTargetCoins: 1000000,
    leagueChallengeExpiresAt: Date.now() + 42 * 3600 * 1000,
    leagueFragments: { blue: 8, red: 6, gold: 5, purple: 4 },
    walletCoins: 15200,
    creatorEarningsKsh: 148500,
    creatorPendingKsh: 3500,
    liveStrikes: 0,
    isLiveSuspended: false,
    isAccountSuspended: false,
    blockedUserIds: [],
    role: 'user'
  },
  {
    id: 'user_maya',
    username: 'Maya_Vibes',
    displayName: 'Maya Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: '🎨 Digital Artist & Creative Storyteller | Creating visual magic on TIME UP ✨',
    dob: '2001-08-04',
    ageVerified: true,
    isVerified: true,
    followersCount: 54100,
    followingCount: 620,
    likesReceivedCount: 412000,
    postsCount: 44,
    gifterLevel: 18,
    gifterXp: 14200,
    isEnigmaEligible: false,
    isEnigmaPurchased: false,
    isEnigmaActive: false,
    creatorLeague: 'B1',
    leagueCoinsReceived: 310000,
    leagueTargetCoins: 500000,
    leagueChallengeExpiresAt: Date.now() + 28 * 3600 * 1000,
    leagueFragments: { blue: 5, red: 4, gold: 2, purple: 0 },
    walletCoins: 2100,
    creatorEarningsKsh: 12400,
    creatorPendingKsh: 800,
    liveStrikes: 0,
    isLiveSuspended: false,
    isAccountSuspended: false,
    blockedUserIds: [],
    role: 'user'
  },
  {
    id: 'user_tariq',
    username: 'Tariq_Beats',
    displayName: 'Tariq Music',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: '🎵 Producer & Sound Explorer | Drop in my LIVE sessions every Friday 🎧',
    dob: '1999-02-14',
    ageVerified: true,
    isVerified: false,
    followersCount: 18900,
    followingCount: 310,
    likesReceivedCount: 98000,
    postsCount: 29,
    gifterLevel: 12,
    gifterXp: 6200,
    isEnigmaEligible: false,
    isEnigmaPurchased: false,
    isEnigmaActive: false,
    creatorLeague: 'C1',
    leagueCoinsReceived: 75000,
    leagueTargetCoins: 100000,
    leagueChallengeExpiresAt: Date.now() + 19 * 3600 * 1000,
    leagueFragments: { blue: 3, red: 2, gold: 0, purple: 0 },
    walletCoins: 850,
    creatorEarningsKsh: 4200,
    creatorPendingKsh: 0,
    liveStrikes: 1, // Has 1 warning strike to test safety UI
    isLiveSuspended: false,
    isAccountSuspended: false,
    blockedUserIds: [],
    role: 'user'
  }
];

const SEED_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user_apex',
    author: SEED_USERS[1],
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-performing-a-street-dance-routine-42512-large.mp4',
    caption: 'Big vibes in Nairobi tonight! Reached A1 Creator League thanks to my amazing live family! 🇰🇪✨ Who is pulling up to the 10-guest stream?',
    tags: ['NairobiVibes', 'TimeUpLive', 'CreatorLeague', 'A1Host'],
    musicTitle: 'Afro-Beats Elevation (Official TIME UP Mix)',
    likesCount: 18450,
    commentsCount: 942,
    repostsCount: 420,
    sharesCount: 1280,
    giftsTotalCoins: 14200,
    createdAt: '2 hours ago',
    isLiked: false,
    isSaved: false,
    isReposted: false,
    isGiftEligible: true,
    violationStatus: 'clean'
  },
  {
    id: 'post_2',
    userId: 'user_maya',
    author: SEED_USERS[2],
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    caption: 'Tried the new Funny Alien & Sparkle face effects in Creator Studio! 👽✨ TIME UP filter engine is so crisp. Which filter should I use next in LIVE?',
    tags: ['FaceFilters', 'CreatorStudio', 'Creative', 'TimeUp'],
    musicTitle: 'Cyber Dreamscape 2026',
    likesCount: 9230,
    commentsCount: 312,
    repostsCount: 180,
    sharesCount: 410,
    giftsTotalCoins: 4800,
    createdAt: '5 hours ago',
    isLiked: true,
    isSaved: true,
    isReposted: false,
    isGiftEligible: true,
    violationStatus: 'clean'
  },
  {
    id: 'post_3',
    userId: 'user_current',
    author: SEED_USERS[0],
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    caption: 'VIP Diamond Gifter level 28 unlocked! 👑 Remember: Connect. Create. Rise. Ready to support upcoming talent in the Creator Leagues! 💜',
    tags: ['DiamondGifter', 'ConnectCreateRise', 'QueenStar', 'TimeUpVIP'],
    musicTitle: 'Royal Fanfare & Future Bass',
    likesCount: 34120,
    commentsCount: 1820,
    repostsCount: 1100,
    sharesCount: 3400,
    giftsTotalCoins: 28900,
    createdAt: '1 day ago',
    isLiked: true,
    isSaved: false,
    isReposted: true,
    isGiftEligible: true,
    violationStatus: 'clean'
  },
  {
    id: 'post_4',
    userId: 'user_tariq',
    author: SEED_USERS[3],
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    caption: 'Cooking new sounds in the studio 🎹 Dropping real-time synthesized beats in tonight’s 10-person LIVE room. Join the soundboard fun!',
    tags: ['MusicProducer', 'LiveSoundEffects', 'KenyaBeats'],
    musicTitle: 'Acoustic Soul & 808',
    likesCount: 4150,
    commentsCount: 165,
    repostsCount: 78,
    sharesCount: 195,
    giftsTotalCoins: 1850,
    createdAt: '1 day ago',
    isLiked: false,
    isSaved: false,
    isReposted: false,
    isGiftEligible: true,
    violationStatus: 'clean'
  }
];

const SEED_STORIES: Story[] = [
  {
    id: 'story_1',
    userId: 'user_apex',
    author: SEED_USERS[1],
    mediaUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    type: 'photo',
    caption: 'Sound check ready for 10-guest LIVE! 🎤 8:00 PM EAT',
    filterApplied: 'Beauty Filter',
    createdAt: Date.now() - 3600 * 1000 * 3,
    expiresAt: Date.now() + 3600 * 1000 * 21,
    hasViewed: false
  },
  {
    id: 'story_2',
    userId: 'user_maya',
    author: SEED_USERS[2],
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    type: 'photo',
    caption: 'Look at the golden crown filter! ✨ Loving the new effects',
    filterApplied: 'Crown & Sparkles',
    createdAt: Date.now() - 3600 * 1000 * 6,
    expiresAt: Date.now() + 3600 * 1000 * 18,
    hasViewed: false
  },
  {
    id: 'story_3',
    userId: 'user_tariq',
    author: SEED_USERS[3],
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    type: 'photo',
    caption: 'New synthesized bass presets loaded 🎶',
    filterApplied: 'Alien Face',
    createdAt: Date.now() - 3600 * 1000 * 8,
    expiresAt: Date.now() + 3600 * 1000 * 16,
    hasViewed: true
  }
];

const SEED_LIVE_ROOM: LiveRoom = {
  id: 'live_room_apex',
  hostId: 'user_apex',
  host: SEED_USERS[1],
  title: '🔥 AFRO LOUNGE & COMEDY PARTY! 10-Person Stage Open 🇰🇪',
  topic: 'Music & Entertainment',
  viewerCount: 4210,
  status: 'live',
  totalGiftsReceived: 68400,
  guests: [
    {
      position: 1,
      userId: 'guest_1',
      user: {
        id: 'guest_1',
        username: 'Kemi_Vibes',
        displayName: 'Kemi Lagos',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
        bio: 'Afro dancer',
        dob: '2000-01-01',
        ageVerified: true,
        isVerified: true,
        followersCount: 68000,
        followingCount: 210,
        likesReceivedCount: 150000,
        postsCount: 18,
        gifterLevel: 16,
        gifterXp: 12000,
        isEnigmaEligible: false,
        isEnigmaPurchased: false,
        isEnigmaActive: false,
        creatorLeague: 'B2',
        leagueCoinsReceived: 180000,
        leagueTargetCoins: 250000,
        leagueChallengeExpiresAt: Date.now() + 30 * 3600 * 1000,
        leagueFragments: { blue: 4, red: 3, gold: 1, purple: 0 },
        walletCoins: 1200,
        creatorEarningsKsh: 8200,
        creatorPendingKsh: 0,
        liveStrikes: 0,
        isLiveSuspended: false,
        isAccountSuspended: false,
        blockedUserIds: [],
        role: 'user'
      },
      isCameraOn: true,
      isMicOn: true,
      isMutedByHost: false,
      cameraDisabledByHost: false,
      coinsEarnedInLive: 4800
    },
    {
      position: 2,
      userId: 'guest_2',
      user: {
        id: 'guest_2',
        username: 'Sammy_Guitar',
        displayName: 'Sammy Acoustic',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        bio: 'Live acoustic riffs',
        dob: '1997-06-12',
        ageVerified: true,
        isVerified: false,
        followersCount: 32000,
        followingCount: 180,
        likesReceivedCount: 78000,
        postsCount: 22,
        gifterLevel: 10,
        gifterXp: 4800,
        isEnigmaEligible: false,
        isEnigmaPurchased: false,
        isEnigmaActive: false,
        creatorLeague: 'C2',
        leagueCoinsReceived: 28000,
        leagueTargetCoins: 40000,
        leagueChallengeExpiresAt: Date.now() + 24 * 3600 * 1000,
        leagueFragments: { blue: 2, red: 1, gold: 0, purple: 0 },
        walletCoins: 650,
        creatorEarningsKsh: 3400,
        creatorPendingKsh: 0,
        liveStrikes: 0,
        isLiveSuspended: false,
        isAccountSuspended: false,
        blockedUserIds: [],
        role: 'user'
      },
      isCameraOn: true,
      isMicOn: true,
      isMutedByHost: false,
      cameraDisabledByHost: false,
      coinsEarnedInLive: 2900
    },
    {
      position: 3,
      userId: 'guest_3',
      user: {
        id: 'guest_3',
        username: 'Zara_Kenya',
        displayName: 'Zara Official',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
        bio: 'Comedy & banter',
        dob: '2002-09-18',
        ageVerified: true,
        isVerified: true,
        followersCount: 112000,
        followingCount: 350,
        likesReceivedCount: 410000,
        postsCount: 49,
        gifterLevel: 22,
        gifterXp: 26000,
        isEnigmaEligible: false,
        isEnigmaPurchased: false,
        isEnigmaActive: false,
        creatorLeague: 'B1',
        leagueCoinsReceived: 340000,
        leagueTargetCoins: 500000,
        leagueChallengeExpiresAt: Date.now() + 18 * 3600 * 1000,
        leagueFragments: { blue: 6, red: 5, gold: 3, purple: 0 },
        walletCoins: 3800,
        creatorEarningsKsh: 19400,
        creatorPendingKsh: 0,
        liveStrikes: 0,
        isLiveSuspended: false,
        isAccountSuspended: false,
        blockedUserIds: [],
        role: 'user'
      },
      isCameraOn: true,
      isMicOn: false,
      isMutedByHost: false,
      cameraDisabledByHost: false,
      coinsEarnedInLive: 5400
    }
  ],
  strikes: 0
};

class Store {
  currentUser: User = SEED_USERS[0];
  users: User[] = [...SEED_USERS];
  posts: Post[] = [...SEED_POSTS];
  stories: Story[] = [...SEED_STORIES];
  liveRooms: LiveRoom[] = [SEED_LIVE_ROOM];
  liveComments: LiveComment[] = [
    {
      id: 'c1',
      roomId: 'live_room_apex',
      userId: 'user_maya',
      user: SEED_USERS[2],
      text: 'The audio energy tonight is insane!! 🎧✨',
      timestamp: Date.now() - 45000
    },
    {
      id: 'c2',
      roomId: 'live_room_apex',
      userId: 'guest_3',
      user: SEED_LIVE_ROOM.guests[2].user,
      text: 'Kenya to the world! Let us hit that 100k gifts target! 🇰🇪💪',
      timestamp: Date.now() - 25000
    }
  ];
  comments: Record<string, Comment[]> = {
    post_1: [
      {
        id: 'comm_1',
        postId: 'post_1',
        userId: 'user_maya',
        author: SEED_USERS[2],
        text: 'Deserved promotion to A1! You inspire the whole community bro 🙌',
        createdAt: '1h ago',
        likesCount: 42,
        replies: []
      },
      {
        id: 'comm_2',
        postId: 'post_1',
        userId: 'user_current',
        author: SEED_USERS[0],
        text: 'Dropping by tonight with some big gifts! Be ready 👑💎',
        createdAt: '45m ago',
        likesCount: 88,
        replies: [
          {
            id: 'comm_2_1',
            postId: 'post_1',
            userId: 'user_apex',
            author: SEED_USERS[1],
            text: 'Queen Star in the house! The diamond legend herself! 🔥',
            createdAt: '30m ago',
            likesCount: 29
          }
        ]
      }
    ]
  };
  transactions: CoinTransaction[] = [
    {
      id: 'tx_1',
      userId: 'user_current',
      type: 'recharge',
      amountCoins: 5600,
      amountKsh: 5000,
      description: 'M-Pesa STK Push recharge (Package 5,600 coins)',
      timestamp: Date.now() - 86400000 * 2,
      status: 'completed',
      paymentMethod: 'M-Pesa'
    },
    {
      id: 'tx_2',
      userId: 'user_current',
      type: 'gift_sent',
      amountCoins: 2500,
      description: 'Sent Galaxy Rocket to Apex_Live',
      timestamp: Date.now() - 86400000,
      status: 'completed'
    }
  ];
  withdrawals: WithdrawalRequest[] = [
    {
      id: 'wd_1',
      userId: 'user_current',
      user: SEED_USERS[0],
      amountKsh: 12000,
      method: 'M-Pesa',
      accountDetails: '+254 712 345 678',
      requestedAt: Date.now() - 86400000 * 3,
      status: 'approved'
    }
  ];
  reports: ModerationReport[] = [
    {
      id: 'rep_1',
      reporterId: 'user_apex',
      reportedUserId: 'spam_bot_99',
      reason: 'Spamming automated scam links',
      details: 'User posted duplicate crypto fraud links in live chat.',
      status: 'pending',
      timestamp: Date.now() - 3600000 * 4
    }
  ];
  appeals: ViolationAppeal[] = [
    {
      id: 'app_1',
      userId: 'user_tariq',
      username: 'Tariq_Beats',
      strikeNumber: 1,
      violationReason: 'Background music copyright misunderstanding during sound test.',
      appealExplanation: 'The audio played was my original royalty-free sample loop that I produced myself. Attached stems proof.',
      evidenceNotes: 'Original DAW project file screenshot and producer license provided.',
      status: 'pending',
      submittedAt: Date.now() - 3600000 * 12
    }
  ];
  auditLogs: AdminAuditLog[] = [
    {
      id: 'audit_1',
      adminUsername: 'Queen_Star (Admin)',
      action: 'APPROVE_WITHDRAWAL',
      target: 'wd_1 (KSh 12,000)',
      details: 'Verified identity and cleared M-Pesa batch payout.',
      timestamp: Date.now() - 86400000 * 2
    },
    {
      id: 'audit_2',
      adminUsername: 'System Engine',
      action: 'LEAGUE_PROMOTION_EVAL',
      target: 'user_apex',
      details: 'Promoted to A1 Creator League upon reaching 1,000,000+ gift coins.',
      timestamp: Date.now() - 86400000 * 3
    }
  ];
  notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      type: 'gift',
      fromUser: SEED_USERS[1],
      title: 'Galaxy Rocket Received! 🚀',
      message: 'Apex_Live sent you a Galaxy Rocket (2,500 coins)!',
      timestamp: Date.now() - 3600000 * 2,
      read: false
    },
    {
      id: 'notif_2',
      type: 'live_invite',
      fromUser: SEED_USERS[1],
      title: '10-Guest LIVE Invitation',
      message: 'Apex_Live invited you to take a guest seat on stage!',
      timestamp: Date.now() - 3600000 * 5,
      read: false
    },
    {
      id: 'notif_3',
      type: 'fan_club',
      title: 'Fan Club Points Ready',
      message: 'Claim your 150 daily Guardian Fan Club points!',
      timestamp: Date.now() - 3600000 * 8,
      read: true
    }
  ];
  messages: DirectMessage[] = [
    {
      id: 'm1',
      senderId: 'user_apex',
      receiverId: 'user_current',
      text: 'Hey Queen Star! Thanks for joining the live stream earlier, the energy was wild! 🔥',
      timestamp: Date.now() - 3600000 * 2,
      read: true
    },
    {
      id: 'm2',
      senderId: 'user_current',
      receiverId: 'user_apex',
      text: 'Always a pleasure Apex! Your A1 celebration was well deserved! 👑',
      timestamp: Date.now() - 3600000 * 1,
      read: true
    }
  ];

  // Configurable revenue splits:
  // Guest gift: Platform 30%, Host 10%, Guest 60%
  // Host gift: Platform 35%, Host 65%
  revenueSplits = {
    guestPlatform: 0.30,
    guestHost: 0.10,
    guestRecipient: 0.60,
    hostPlatform: 0.35,
    hostRecipient: 0.65
  };

  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        currentUser: this.currentUser,
        users: this.users,
        posts: this.posts,
        stories: this.stories,
        transactions: this.transactions,
        withdrawals: this.withdrawals,
        reports: this.reports,
        appeals: this.appeals,
        auditLogs: this.auditLogs,
        revenueSplits: this.revenueSplits
      };
      localStorage.setItem('timeup_store_data', JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('timeup_store_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentUser) this.currentUser = parsed.currentUser;
        if (parsed.users) this.users = parsed.users;
        if (parsed.posts) this.posts = parsed.posts;
        if (parsed.stories) this.stories = parsed.stories;
        if (parsed.transactions) this.transactions = parsed.transactions;
        if (parsed.withdrawals) this.withdrawals = parsed.withdrawals;
        if (parsed.reports) this.reports = parsed.reports;
        if (parsed.appeals) this.appeals = parsed.appeals;
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
        if (parsed.revenueSplits) this.revenueSplits = parsed.revenueSplits;
      }
    } catch {
      // ignore
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(l => l());
  }

  // --- ACTIONS ---

  switchUser(userId: string) {
    const found = this.users.find(u => u.id === userId);
    if (found) {
      this.currentUser = found;
      this.notify();
    }
  }

  // Gifting & Revenue distribution
  sendGiftInLive(gift: VirtualGift, targetGuestPosition?: number): { success: boolean; message: string } {
    if (this.currentUser.walletCoins < gift.coins) {
      return { success: false, message: 'Insufficient coins in your TIME UP wallet. Please recharge!' };
    }

    const room = this.liveRooms[0];
    if (!room || room.status !== 'live') {
      return { success: false, message: 'Live stream is not active.' };
    }

    // Deduct coins from sender
    this.currentUser.walletCoins -= gift.coins;

    // Award XP to sender (1 coin = 1 XP)
    this.currentUser.gifterXp += gift.coins;
    // Check level up (Max 50)
    const newLevel = Math.min(50, Math.max(1, Math.floor(Math.sqrt(this.currentUser.gifterXp / 50)) + 1));
    if (newLevel > this.currentUser.gifterLevel) {
      this.currentUser.gifterLevel = newLevel;
      if (newLevel >= 25) {
        this.currentUser.isEnigmaEligible = true;
      }
    }

    // Backend ledger calculation based on Section 16 rules
    let platformShare = 0;
    let hostShare = 0;
    let recipientShare = 0;
    let recipientUser: User;
    const coins = gift.coins;
    // 1 coin = approx 0.9 KSh creator value
    const kshValue = coins * 0.9;

    const host = this.users.find(u => u.id === room.hostId) || room.host;

    if (targetGuestPosition !== undefined && targetGuestPosition > 0) {
      // Guest received the gift:
      // Platform: 30%, Host: 10%, Guest: 60%
      platformShare = coins * this.revenueSplits.guestPlatform;
      hostShare = coins * this.revenueSplits.guestHost;
      recipientShare = coins * this.revenueSplits.guestRecipient;

      const guestSlot = room.guests.find(g => g.position === targetGuestPosition);
      if (guestSlot) {
        guestSlot.coinsEarnedInLive += coins;
        recipientUser = guestSlot.user;
        recipientUser.creatorEarningsKsh += recipientShare * 0.9;
      } else {
        recipientUser = host;
      }
      host.creatorEarningsKsh += hostShare * 0.9;
    } else {
      // Host received the gift:
      // Platform: 35%, Host: 65%
      platformShare = coins * this.revenueSplits.hostPlatform;
      recipientShare = coins * this.revenueSplits.hostRecipient;
      hostShare = recipientShare;
      recipientUser = host;
      host.creatorEarningsKsh += recipientShare * 0.9;
    }

    // Update Creator League progress for host
    host.leagueCoinsReceived += coins;
    this.evaluateLeagueProgression(host);

    room.totalGiftsReceived += coins;

    // Record sender transaction
    this.transactions.unshift({
      id: `tx_${Date.now()}`,
      userId: this.currentUser.id,
      type: 'gift_sent',
      amountCoins: coins,
      description: `Sent ${gift.name} (${gift.icon}) to ${recipientUser.displayName}`,
      timestamp: Date.now(),
      status: 'completed'
    });

    // Add Live gift comment
    const isEnigma = this.currentUser.isEnigmaActive;
    this.liveComments.unshift({
      id: `lc_${Date.now()}_${Math.random()}`,
      roomId: room.id,
      userId: this.currentUser.id,
      user: this.currentUser,
      text: `sent ${gift.name} ${gift.icon}!`,
      timestamp: Date.now(),
      isGiftNotice: true,
      giftName: gift.name,
      giftCoins: gift.coins,
      isEnigma
    });

    this.notify();
    return { success: true, message: `Sent ${gift.name} successfully!` };
  }

  // Send gift on feed post
  sendGiftOnPost(postId: string, gift: VirtualGift): { success: boolean; message: string } {
    if (this.currentUser.walletCoins < gift.coins) {
      return { success: false, message: 'Insufficient coins in wallet.' };
    }
    const post = this.posts.find(p => p.id === postId);
    if (!post) return { success: false, message: 'Post not found.' };

    this.currentUser.walletCoins -= gift.coins;
    this.currentUser.gifterXp += gift.coins;
    const newLevel = Math.min(50, Math.max(1, Math.floor(Math.sqrt(this.currentUser.gifterXp / 50)) + 1));
    if (newLevel > this.currentUser.gifterLevel) {
      this.currentUser.gifterLevel = newLevel;
    }

    post.giftsTotalCoins += gift.coins;
    // Creator receives 65% of post gift
    post.author.creatorEarningsKsh += (gift.coins * 0.65) * 0.9;

    this.transactions.unshift({
      id: `tx_${Date.now()}`,
      userId: this.currentUser.id,
      type: 'gift_sent',
      amountCoins: gift.coins,
      description: `Sent ${gift.name} on post by @${post.author.username}`,
      timestamp: Date.now(),
      status: 'completed'
    });

    this.notify();
    return { success: true, message: `Sent ${gift.name} to @${post.author.username}!` };
  }

  // Evaluate Creator League (D2 -> A1)
  private evaluateLeagueProgression(user: User) {
    const coins = user.leagueCoinsReceived;
    let newLeague: CreatorLeague = 'D2';
    let target = 5000;

    if (coins >= 1000000) {
      newLeague = 'A1';
      target = 1000000;
    } else if (coins >= 500000) {
      newLeague = 'A2';
      target = 1000000;
    } else if (coins >= 250000) {
      newLeague = 'B1';
      target = 500000;
    } else if (coins >= 100000) {
      newLeague = 'B2';
      target = 250000;
    } else if (coins >= 40000) {
      newLeague = 'C1';
      target = 100000;
    } else if (coins >= 15000) {
      newLeague = 'C2';
      target = 40000;
    } else if (coins >= 5000) {
      newLeague = 'D1';
      target = 15000;
    }

    if (newLeague !== user.creatorLeague) {
      user.creatorLeague = newLeague;
      user.leagueTargetCoins = target;
      // Award collectible league fragment
      if (newLeague.startsWith('A')) user.leagueFragments.purple += 1;
      else if (newLeague.startsWith('B')) user.leagueFragments.gold += 1;
      else if (newLeague.startsWith('C')) user.leagueFragments.red += 1;
      else user.leagueFragments.blue += 1;

      this.auditLogs.unshift({
        id: `audit_${Date.now()}`,
        adminUsername: 'League Engine',
        action: 'LEAGUE_UPDATE',
        target: `@${user.username}`,
        details: `Updated to league ${newLeague} (${coins.toLocaleString()} coins). Fragment earned!`,
        timestamp: Date.now()
      });
    }
  }

  // Recharge coins
  rechargeCoins(pkg: CoinPackage, method: string): { success: boolean; message: string } {
    this.currentUser.walletCoins += pkg.coins;
    this.transactions.unshift({
      id: `tx_${Date.now()}`,
      userId: this.currentUser.id,
      type: 'recharge',
      amountCoins: pkg.coins,
      amountKsh: pkg.priceKsh,
      description: `Recharged ${pkg.coins} coins via ${method}`,
      timestamp: Date.now(),
      status: 'completed',
      paymentMethod: method
    });
    this.notify();
    return { success: true, message: `Successfully added ${pkg.coins} coins to your wallet via ${method}!` };
  }

  // Enigma Mode
  purchaseEnigma(): { success: boolean; message: string } {
    if (this.currentUser.gifterLevel < 25) {
      return { success: false, message: 'ENIGMA mode requires Gifter Level 25 or higher.' };
    }
    if (this.currentUser.walletCoins < 4999) {
      return { success: false, message: 'ENIGMA membership requires 4,999 coins.' };
    }
    this.currentUser.walletCoins -= 4999;
    this.currentUser.isEnigmaPurchased = true;
    this.currentUser.isEnigmaActive = true;
    this.transactions.unshift({
      id: `tx_${Date.now()}`,
      userId: this.currentUser.id,
      type: 'enigma_purchase',
      amountCoins: 4999,
      description: 'ENIGMA VIP Membership unlocked',
      timestamp: Date.now(),
      status: 'completed'
    });
    this.notify();
    return { success: true, message: 'ENIGMA mode activated! Your username is now shrouded in mystery.' };
  }

  toggleEnigma() {
    if (this.currentUser.isEnigmaPurchased) {
      this.currentUser.isEnigmaActive = !this.currentUser.isEnigmaActive;
      this.notify();
    }
  }

  // Request withdrawal
  requestWithdrawal(amountKsh: number, method: 'M-Pesa' | 'Bank' | 'PayPal', accountDetails: string): { success: boolean; message: string } {
    if (amountKsh < 200) {
      return { success: false, message: 'Minimum withdrawal amount is KSh 200.' };
    }
    if (amountKsh > this.currentUser.creatorEarningsKsh) {
      return { success: false, message: 'Withdrawal amount exceeds available earnings balance.' };
    }

    this.currentUser.creatorEarningsKsh -= amountKsh;
    this.currentUser.creatorPendingKsh += amountKsh;

    const wd: WithdrawalRequest = {
      id: `wd_${Date.now()}`,
      userId: this.currentUser.id,
      user: this.currentUser,
      amountKsh,
      method,
      accountDetails,
      requestedAt: Date.now(),
      status: 'pending'
    };

    this.withdrawals.unshift(wd);
    this.notify();
    return { success: true, message: `Withdrawal request for KSh ${amountKsh.toLocaleString()} submitted for security audit.` };
  }

  // Post interactions
  toggleLike(postId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    this.notify();
  }

  toggleSave(postId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    post.isSaved = !post.isSaved;
    this.notify();
  }

  toggleRepost(postId: string) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    post.isReposted = !post.isReposted;
    post.repostsCount += post.isReposted ? 1 : -1;
    this.notify();
  }

  addComment(postId: string, text: string) {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !text.trim()) return;

    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      userId: this.currentUser.id,
      author: this.currentUser,
      text: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      replies: []
    };

    if (!this.comments[postId]) this.comments[postId] = [];
    this.comments[postId].unshift(newComment);
    post.commentsCount += 1;
    this.notify();
  }

  // Fan Club
  joinFanClub(creatorId: string, creatorName: string): { success: boolean; message: string } {
    if (this.currentUser.walletCoins < 50) {
      return { success: false, message: 'Joining a Fan Club requires 50 coins.' };
    }
    this.currentUser.walletCoins -= 50;
    this.currentUser.fanClub = {
      creatorId,
      creatorName,
      role: 'Member',
      points: 100,
      level: 1,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    this.notify();
    return { success: true, message: `Joined ${creatorName}'s Fan Club as an official Member! 💜` };
  }

  claimFanClubPoints(): { success: boolean; message: string } {
    if (!this.currentUser.fanClub) return { success: false, message: 'You have not joined a Fan Club.' };
    this.currentUser.fanClub.points += 150;
    if (this.currentUser.fanClub.points >= 2000) {
      this.currentUser.fanClub.role = 'Guardian';
      this.currentUser.fanClub.level = 8;
    } else if (this.currentUser.fanClub.points >= 800) {
      this.currentUser.fanClub.role = 'Superfan';
      this.currentUser.fanClub.level = 4;
    }
    this.notify();
    return { success: true, message: '+150 Fan Club points claimed! Your badge shines brighter.' };
  }

  // Create post / story
  publishPost(postData: Omit<Post, 'id' | 'author' | 'likesCount' | 'commentsCount' | 'repostsCount' | 'sharesCount' | 'giftsTotalCoins' | 'createdAt' | 'isLiked' | 'isSaved' | 'isReposted' | 'isGiftEligible'>) {
    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      userId: this.currentUser.id,
      author: this.currentUser,
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      sharesCount: 0,
      giftsTotalCoins: 0,
      createdAt: 'Just now',
      isLiked: false,
      isSaved: false,
      isReposted: false,
      isGiftEligible: true
    };
    this.posts.unshift(newPost);
    this.currentUser.postsCount += 1;
    this.notify();
  }

  publishStory(mediaUrl: string, type: 'photo' | 'video', caption?: string, filterApplied?: string) {
    const story: Story = {
      id: `story_${Date.now()}`,
      userId: this.currentUser.id,
      author: this.currentUser,
      mediaUrl,
      type,
      caption,
      filterApplied,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 3600 * 1000,
      hasViewed: true
    };
    this.stories.unshift(story);
    this.notify();
  }

  // Moderation & 3-Strike LIVE Policy
  issueLiveStrike(userId: string, reason: string): { strikeCount: number; message: string } {
    const user = this.users.find(u => u.id === userId) || (this.currentUser.id === userId ? this.currentUser : null);
    if (!user) return { strikeCount: 0, message: 'User not found.' };

    user.liveStrikes = (user.liveStrikes || 0) + 1;
    let message = '';

    if (user.liveStrikes === 1) {
      message = `First Warning: Strike 1/3 recorded. Reason: ${reason}. Please adhere to TIME UP community guidelines.`;
    } else if (user.liveStrikes === 2) {
      message = `Final Warning: Strike 2/3 recorded. Repeated violations will result in automatic LIVE termination.`;
    } else {
      // 3rd strike: terminate live & suspend
      user.isLiveSuspended = true;
      user.liveSuspensionExpiresAt = Date.now() + 7 * 86400000; // 7 days default
      message = `Strike 3/3: LIVE session automatically terminated. LIVE broadcasting suspended for 7 days.`;
      
      const room = this.liveRooms.find(r => r.hostId === userId);
      if (room) {
        room.status = 'ended';
      }
    }

    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminUsername: 'Moderation System',
      action: 'LIVE_STRIKE_ISSUED',
      target: `@${user.username} (Strike ${user.liveStrikes}/3)`,
      details: reason,
      timestamp: Date.now()
    });

    this.notify();
    return { strikeCount: user.liveStrikes, message };
  }

  submitAppeal(strikeNumber: number, reason: string, evidenceNotes: string): { success: boolean; message: string } {
    const appeal: ViolationAppeal = {
      id: `appeal_${Date.now()}`,
      userId: this.currentUser.id,
      username: this.currentUser.username,
      strikeNumber,
      violationReason: reason,
      appealExplanation: 'User contends violation was incorrect or misidentified.',
      evidenceNotes,
      status: 'pending',
      submittedAt: Date.now()
    };
    this.appeals.unshift(appeal);
    this.notify();
    return { success: true, message: 'Appeal submitted to independent moderation panel for review.' };
  }

  resolveAppeal(appealId: string, approved: boolean, notes: string) {
    const appeal = this.appeals.find(a => a.id === appealId);
    if (!appeal) return;
    appeal.status = approved ? 'approved' : 'rejected';
    appeal.reviewedBy = this.currentUser.username;

    if (approved) {
      const targetUser = this.users.find(u => u.id === appeal.userId);
      if (targetUser) {
        targetUser.liveStrikes = Math.max(0, targetUser.liveStrikes - 1);
        if (targetUser.liveStrikes < 3) {
          targetUser.isLiveSuspended = false;
        }
      }
    }

    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminUsername: this.currentUser.username,
      action: approved ? 'APPEAL_APPROVED' : 'APPEAL_REJECTED',
      target: appeal.username,
      details: notes,
      timestamp: Date.now()
    });

    this.notify();
  }

  // Admin Actions
  updateRevenueSplits(splits: typeof Store.prototype.revenueSplits) {
    this.revenueSplits = splits;
    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminUsername: this.currentUser.username,
      action: 'UPDATE_REVENUE_SPLITS',
      target: 'Platform Settings',
      details: `Updated splits: Guest Platform ${(splits.guestPlatform*100)}%, Host Platform ${(splits.hostPlatform*100)}%`,
      timestamp: Date.now()
    });
    this.notify();
  }

  processWithdrawal(wdId: string, approved: boolean) {
    const wd = this.withdrawals.find(w => w.id === wdId);
    if (!wd) return;
    wd.status = approved ? 'approved' : 'rejected';
    const user = this.users.find(u => u.id === wd.userId);
    if (user) {
      user.creatorPendingKsh = Math.max(0, user.creatorPendingKsh - wd.amountKsh);
      if (!approved) {
        // Return funds to creator balance
        user.creatorEarningsKsh += wd.amountKsh;
      }
    }
    this.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminUsername: this.currentUser.username,
      action: approved ? 'APPROVE_WITHDRAWAL' : 'REJECT_WITHDRAWAL',
      target: wd.id,
      details: `Processed KSh ${wd.amountKsh} for @${wd.user.username}`,
      timestamp: Date.now()
    });
    this.notify();
  }
}

export const appStore = new Store();
