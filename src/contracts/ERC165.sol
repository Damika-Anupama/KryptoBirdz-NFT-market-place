// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './interfaces/IERC165.sol';

contract ERC165 is IERC165 {
    mapping (bytes4 => bool) internal _supportedInterfaces;

    constructor() {
        _registerInterface(bytes4(keccak256('supportsInterface(bytes4)')));
    }
    function supportsInterface(bytes4 interfaceID) external view override returns (bool) {
        return _supportedInterfaces[interfaceID];
    }

    function _registerInterface(bytes4 interfaceID) internal {
        require(interfaceID != 0xffffffff, "ERC165: invalid interface id");
        _supportedInterfaces[interfaceID] = true;
    }


}