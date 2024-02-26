import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
    // If negative, you owe your friend
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
    // If positive, your friend owe your
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
    // No one owe other
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddForm, setshowAddForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend() {
    setshowAddForm(showAddForm => !showAddForm);
  }

  function handleAddFriendToList(friend) {
    setFriends((friends) => [...friends, friend]);
    setshowAddForm(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curSelected) => 
      curSelected?.id === friend.id ? null : friend
    );
    setshowAddForm(false);
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => 
      friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend  
    ));
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddForm && <FormAddFriend onAddFriend={handleAddFriendToList} />}

        <Button onClick={handleAddFriend}>
          {showAddForm ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && <FormSplitBill key={selectedFriend.id} selectedFriend={selectedFriend} onHandleSplitBill={handleSplitBill}/>}
    </div>
  )
}

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return <ul>
    {friends.map(friend =>
    (<Friend 
      friend={friend} 
      key={friend.id} 
      onSelection={onSelection} 
      selectedFriend={selectedFriend} />
    ))}
  </ul>
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return <li className={isSelected ? "selected" : ""}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>
    {friend.balance < 0 &&
      <p className="red">
        You owe {friend.name} {Math.abs(friend.balance)}$
      </p>
    }
    {friend.balance > 0 &&
      <p className="green">
        {friend.name} owes you {Math.abs(friend.balance)}$
      </p>
    }
    {friend.balance === 0 &&
      <p>
        You and {friend.name} are even
      </p>
    }
    <Button onClick={() => onSelection(friend)}>
      {isSelected ? "Close" : "Select"}
    </Button>
  </li>
}



function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    }
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯‍♀️ Friend name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>🖼️ Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend, onHandleSplitBill }) {
  const [bill, setBill] = useState("");
  const [payByUser, setpayByUser] = useState('');
  const [whoIsPaying, setwhoIsPaying] = useState("user");
  const payByFriend = bill ? bill - payByUser : "";
  // Kiểm ra xem bill là số hay là chuỗi
  // Nếu là một chuỗi rỗng lúc đầu thì sẽ trả về false
  // Sẽ trả về một chuỗi rỗng hiển thị cho người dùng
  // Nếu là một số thì sẽ tính toán 
  function handleSubmit(e) {
    e.preventDefault();
    if(!bill || !payByUser) return;
    onHandleSplitBill(whoIsPaying === 'user' ? payByFriend : -payByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill Value</label>
      <input type="text" 
        value={bill} 
        onChange={(e) => setBill(Number(e.target.value))} min={0} />

      <label>🙆‍♂️ Your expense</label>
      <input type="number" 
        value={payByUser} 
        onChange={(e) => setpayByUser(
          Number(e.target.value) > bill ? payByUser : 
          Number(e.target.value)
        )}  min={0} />

      <label>🤼‍♂️ {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={payByFriend} />

      <label>🙆‍♂️ Who is paying the bill</label>
      <select 
        value={whoIsPaying} 
        onChange={(e) => setwhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  )
}
