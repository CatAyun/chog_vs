// SPDX-License-Identifier: MIT
// 整文件复制到 Remix 即可编译部署（无需 import 其它文件）
pragma solidity ^0.8.24;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}

/// @notice CHOG RPS 配置合约：固化 CHOG / NFT / 回购金库
contract ChogRPSConfig {
    IERC20 public immutable chog;
    IERC721 public immutable chogNft;
    address public treasury;
    address public owner;
    address public game;

    event TreasuryUpdated(address treasury);
    event GameSet(address game);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address _chog, address _chogNft, address _treasury) {
        require(_chog != address(0) && _chogNft != address(0) && _treasury != address(0), "zero");
        chog = IERC20(_chog);
        chogNft = IERC721(_chogNft);
        treasury = _treasury;
        owner = msg.sender;
    }

    function hasChogNft(address account) external view returns (bool) {
        return chogNft.balanceOf(account) > 0;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "zero");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    function setGame(address _game) external onlyOwner {
        require(_game != address(0), "zero");
        game = _game;
        emit GameSet(_game);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }
}
