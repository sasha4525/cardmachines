import { useEffect, useState } from "react";

function App() {

  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [wheelText, setWheelText] = useState("??");

  useEffect(() => {
    loadUser();
    loadInventory();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch("/user");
      const data = await res.json();
      setCoins(data.coins);
    } catch (err) {
      console.log("Server error:", err);
    }
  };

  const loadInventory = async () => {
    try {
      const res = await fetch("/inventory");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.log("Inventory error:", err);
    }
  };

  const spin = async () => {
    try {
      const res = await fetch("/spin", { method: "POST" });
      const data = await res.json();

      if (!data.success) {
        alert("Немає монет!");
        return;
      }

      setWheelText("?? Крутиться...");

      setTimeout(() => {
        setWheelText(data.car.toUpperCase());
        loadUser();
        loadInventory();
      }, 1500);

    } catch (err) {
      console.log("Spin error:", err);
    }
  };

  const getCoins = async () => {
    try {
      const res = await fetch("/get-coins", { method: "POST" });
      const data = await res.json();

      if (!data.success) {
        alert("Тільки для адміна!");
        return;
      }

      loadUser();
    } catch (err) {
      console.log("Coins error:", err);
    }
  };

  const adminLogin = async () => {
    const pass = prompt("Введи пароль");

    try {
      const res = await fetch("/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass })
      });

      const data = await res.json();

      if (data.success) {
        alert("Адмін активований!");
      } else {
        alert("Невірний пароль");
      }

    } catch (err) {
      console.log("Admin error:", err);
    }
  };

  return (
    <div style={{background:"#111",color:"white",minHeight:"100vh",textAlign:"center",padding:"30px"}}>

      <h2>Coins: {coins}</h2>

      <div style={{
        margin:"30px auto",
        width:"250px",
        height:"250px",
        borderRadius:"50%",
        border:"6px solid gold",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:"22px"
      }}>
        {wheelText}
      </div>

      <button onClick={spin}>Крутити</button>
      <button onClick={getCoins}>+5 монет</button>

      <h3>Інвентар</h3>

      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center"}}>
        {inventory.map(car => (
          <div key={car.name} style={{
            background:"#222",
            padding:"10px",
            margin:"10px",
            borderRadius:"10px"
          }}>
            <div>{car.name.toUpperCase()}</div>
            <div>x{car.count}</div>
          </div>
        ))}
      </div>

      <button
        onClick={adminLogin}
        style={{opacity:0.4,fontSize:"11px",marginTop:"40px"}}
      >
        Вхід для адмінів
      </button>

    </div>
  );
}

export default App;