// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCount;

    event Transfer(
        address from,
        address reciever,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    struct transferStruct {
        address sender;
        address reciever;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    transferStruct[] transactions;

    function addToBloackchain(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        transactionCount++;
        transactions.push(
            transferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        );

        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }

    function getAllTransactions()
        public
        view
        returns (transferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
