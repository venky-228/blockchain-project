pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;
    address public seller = 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a;

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        uint256 itemId;
        address buyer;
        uint256 cost;
    }

    mapping(uint256 => Item) public items;
    Order[] public orders;

    event Buy(address indexed buyer, uint256 itemId, uint256 cost, uint256 time);
    event List(string name, uint256 cost, uint256 quantity);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can view orders");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        Item memory item = Item(_id, _name, _category, _image, _cost, _rating, _stock);
        items[_id] = item;
        emit List(_name, _cost, _stock);
    }

    function buy(uint256 _id) public payable {
        Item memory item = items[_id];
        require(msg.value >= item.cost, "Insufficient funds");
        require(item.stock > 0, "Item out of stock");

        // Reduce stock
        items[_id].stock--;

        // Record the order
        orders.push(Order(block.timestamp, _id, msg.sender, item.cost));

        // Transfer funds to seller
        (bool success, ) = seller.call{value: msg.value}("");
        require(success, "Transfer to seller failed");

        emit Buy(msg.sender, _id, item.cost, block.timestamp);
    }

    function getOrders() public view onlySeller returns (Order[] memory) {
        return orders;
    }
}
