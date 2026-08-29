// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title FeeCollector — Anti Krisis platform-fee recipient (AKK-4 Option B)
/// @notice Holds every platform-fee payment and emits `FeePaid` for each one so
///         the ICP backend can verify that a fee tx actually reached THIS
///         collector (defeats address-squatting on chains where the collector
///         is not yet deployed).
/// @dev Deployed via the canonical deterministic-deployment proxy factory
///      (0x4e59b44847b379578588920cA78FbF26c0B4956C) so ONE address exists on
///      every EVM chain. Deploy calldata: <32-byte salt> ++ creationCode ++
///      abi.encode(initialOwner). Because deployment goes through the factory,
///      `msg.sender` inside the constructor is the factory — pass the real
///      owner explicitly. Same salt + same owner + same bytecode = same
///      address on every chain.
///
///      The platform-fee tx sends value WITH non-empty calldata (the AKK-4
///      claim-binding payload), so it arrives via `fallback()`; plain
///      value-only deposits (e.g. manual treasury top-ups) arrive via
///      `receive()`. Both emit `FeePaid` so every payment is verifiable.
contract FeeCollector {
    address public owner;

    /// @notice Emitted for every payment the collector accepts.
    /// @param payer   Address that sent the transaction (msg.sender).
    /// @param binding Full calldata of the payment tx (AKK-4 claim-binding
    ///                payload; empty for plain deposits).
    /// @param value   Wei received with the payment.
    event FeePaid(address indexed payer, bytes binding, uint256 value);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error NotOwner();
    error ZeroAddress();

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert ZeroAddress();
        owner = initialOwner;
        emit OwnershipTransferred(address(0), initialOwner);
    }

    /// @notice Accept payments with calldata (the platform-fee path).
    /// solium-disable-next-line
    fallback() external payable {
        emit FeePaid(msg.sender, msg.data, msg.value);
    }

    /// @notice Accept plain value deposits (no calldata).
    receive() external payable {
        emit FeePaid(msg.sender, "", msg.value);
    }

    /// @notice Owner: sweep the entire balance to `target`.
    /// @dev Owner starts as the treasury EOA and is later transferred to the
    ///      canister tECDSA address WITHOUT redeploying (address is fixed).
    function sweep(address payable target) external {
        if (msg.sender != owner) revert NotOwner();
        if (target == address(0)) revert ZeroAddress();
        uint256 amount = address(this).balance;
        (bool ok, ) = target.call{value: amount}("");
        require(ok, "sweep failed");
        assert(address(this).balance == 0);
    }

    /// @notice Owner: hand ownership to a new address (e.g. canister tECDSA).
    function transferOwnership(address newOwner) external {
        if (msg.sender != owner) revert NotOwner();
        if (newOwner == address(0)) revert ZeroAddress();
        address previous = owner;
        owner = newOwner;
        emit OwnershipTransferred(previous, newOwner);
    }
}
