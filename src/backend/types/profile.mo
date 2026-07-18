module {
  public type SocialLink = {
    name : Text;
    url  : Text;
  };

  public type Profile = {
    username       : Text;
    displayName    : Text;
    bio            : Text;
    location       : Text;
    born           : Text;
    superpowers    : Text;
    profilePicture : Text;  // base64 DataURL or object-storage URL
    coverImage     : Text;  // base64 DataURL or object-storage URL
    socials        : [SocialLink];
    evmAddress       : ?Text; // optional Ethereum wallet address for NFT badge checks
    hasOgBadge       : Bool;  // true once the user has claimed the OG NFT badge on ICP
    playerBadgeLevel : Nat;   // 0=none, 1=Player(690), 2=SuperPlayer(6900), 3=AlphaPlayer(69000)
    miningStreak     : Nat;   // consecutive days with gritEarned > 0 in daily snapshots
  };

  public type ProfileInput = {
    username       : Text;
    displayName    : Text;
    bio            : Text;
    location       : Text;
    born           : Text;
    superpowers    : Text;
    profilePicture : Text;
    coverImage     : Text;
    socials        : [SocialLink];
    evmAddress     : ?Text; // optional Ethereum wallet address for NFT badge checks
    // hasOgBadge is intentionally absent from ProfileInput — it can only be set via claimOgBadge()
  };

  /// A profile record enriched with live-resolved fields not stored on the profile itself.
  /// Returned by public query functions so the frontend always gets tribeId.
  public type PublicProfile = {
    username         : Text;
    displayName      : Text;
    bio              : Text;
    location         : Text;
    born             : Text;
    superpowers      : Text;
    profilePicture   : Text;
    coverImage       : Text;
    socials          : [SocialLink];
    evmAddress       : ?Text;
    hasOgBadge       : Bool;
    playerBadgeLevel : Nat;
    miningStreak     : Nat;
    tribeId          : ?Text; // the tribe this user currently belongs to (null if none)
  };

  public type ProfileError = {
    #usernameRequired;
    #usernameAlreadyTaken;
    #usernameTooLong;      // max 15
    #displayNameTooLong;   // max 30
    #bioTooLong;           // max 500
    #locationTooLong;      // max 30
    #superpowersTooLong;   // max 250
    #socialLinkTooLong;    // name or url > 100
  };
};
