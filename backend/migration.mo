import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldBankDetails = {
    bankName : Text;
    accountNumber : Text;
    ifsc : Text;
    cardNumber : Text;
    expiryDate : Text;
    cvv : Text;
    atmPin : Text;
    phoneNumber : Text;
    emailId : Text;
  };

  type OldActor = {
    completeBankDetails : Map.Map<Principal.Principal, OldBankDetails>;
  };

  type NewBankDetails = {
    bankName : Text;
    accountNumber : Text;
    ifsc : Text;
    cardNumber : Text;
    expiryDate : Text;
    cvv : Text;
    atmPin : Text;
    phoneNumber : Text;
    emailId : Text;
  };

  type NewActor = {
    completeBankDetails : Map.Map<Principal.Principal, NewBankDetails>;
  };

  // Migration function for actor state change (old to new navigation)
  public func run(old : OldActor) : NewActor {
    {
      completeBankDetails = old.completeBankDetails;
    };
  };
};
