module {
  public type AllowlistedToken = {
    tokenAddress : Text;
    chain : Text;
    name : Text;
    symbol : Text;
    decimals : Nat;
    priceUSD : Float;
  };

  public type AuditAction = { #add; #remove };

  public type AuditLogEntry = {
    action : AuditAction;
    tokenAddress : Text;
    chain : Text;
    adminPrincipal : Principal;
    timestamp : Int;
  };
};
