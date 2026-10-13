// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}

interface IChogRPSConfig {
    function setGame(address _game) external;
}

/// @notice 单 tx 内：玩家下注 + 链上随机机器人出招 + 结算（动作与结果均上链）
contract ChogRPSVsBot {
    IERC20 public immutable chog;
    IERC721 public immutable chogNft;
    address public immutable treasury;
    address public owner;

    uint16 public constant BPS_WINNER_WITH_NFT = 9000;
    uint16 public constant BPS_WINNER_WITHOUT_NFT = 8000;

    mapping(address => uint256) public nonces;

    /// @dev outcome: 0=平局 1=玩家赢 2=机器人赢
    event GamePlayed(
        address indexed player,
        uint8 playerMove,
        uint8 botMove,
        uint8 outcome,
        uint256 amount,
        uint256 playerPayout,
        uint256 buybackAmount,
        bool hadNft
    );

    error InvalidMove();
    error ZeroAmount();
    error InsufficientHouse();
    error TransferFailed();

    event ChogWithdrawn(address indexed to, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address _chog, address _chogNft, address _treasury) {
        require(_chog != address(0) && _chogNft != address(0) && _treasury != address(0), "zero");
        chog = IERC20(_chog);
        chogNft = IERC721(_chogNft);
        treasury = _treasury;
        owner = msg.sender;
    }

    /// @notice 运营方向合约注入 CHOG，用于匹配机器人侧下注
    function deposit(uint256 amount) external {
        _transferFrom(msg.sender, address(this), amount);
    }

    /// @notice 提取合约内 CHOG（不影响已承诺给玩家的逻辑，请自行保留足够准备金）
    function withdrawChog(uint256 amount) external onlyOwner {
        _transfer(msg.sender, amount);
        emit ChogWithdrawn(msg.sender, amount);
    }

    function withdrawChogAll() external onlyOwner {
        uint256 bal = chog.balanceOf(address(this));
        _transfer(msg.sender, bal);
        emit ChogWithdrawn(msg.sender, bal);
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

    function play(uint8 playerMove, uint256 amount) external {
        if (playerMove > 2) revert InvalidMove();
        if (amount == 0) revert ZeroAmount();
        if (chog.balanceOf(address(this)) < amount) revert InsufficientHouse();

        _transferFrom(msg.sender, address(this), amount);

        uint256 nonce = nonces[msg.sender]++;
        uint8 botMove = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.prevrandao,
                        blockhash(block.number - 1),
                        msg.sender,
                        amount,
                        nonce,
                        playerMove
                    )
                )
            ) % 3
        );

        uint8 outcome = _resolve(playerMove, botMove);
        bool hadNft = chogNft.balanceOf(msg.sender) > 0;
        uint16 winnerBps = hadNft ? BPS_WINNER_WITH_NFT : BPS_WINNER_WITHOUT_NFT;
        uint16 buybackBps = uint16(10000 - winnerBps);

        uint256 pool = amount * 2;
        uint256 playerPayout = 0;
        uint256 buybackAmount = 0;

        if (outcome == 0) {
            playerPayout = amount;
            _transfer(msg.sender, amount);
        } else if (outcome == 1) {
            playerPayout = (pool * winnerBps) / 10000;
            buybackAmount = pool - playerPayout;
            _transfer(msg.sender, playerPayout);
            _transfer(treasury, buybackAmount);
        } else {
            buybackAmount = (pool * buybackBps) / 10000;
            _transfer(treasury, buybackAmount);
        }

        emit GamePlayed(msg.sender, playerMove, botMove, outcome, amount, playerPayout, buybackAmount, hadNft);
    }

    function _resolve(uint8 playerMove, uint8 botMove) internal pure returns (uint8) {
        if (playerMove == botMove) return 0;
        if (
            (playerMove == 0 && botMove == 2) || (playerMove == 1 && botMove == 0) || (playerMove == 2 && botMove == 1)
        ) {
            return 1;
        }
        return 2;
    }

    function _transfer(address to, uint256 amount) internal {
        if (!chog.transfer(to, amount)) revert TransferFailed();
    }

    function _transferFrom(address from, address to, uint256 amount) internal {
        if (!chog.transferFrom(from, to, amount)) revert TransferFailed();
    }
}
