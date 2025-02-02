import { useState } from "react";
import "../styles/SplitBillCalculator.css";

type Order = {
    name: string;
    price: string;
};

export default function SplitBillCalculator() {
    const [people, setPeople] = useState(2);
    const [customPPN, setCustomPPN] = useState(11);
    const [extraCost, setExtraCost] = useState(0);
    const maxPeople = 10;
    const [orders, setOrders] = useState<Order[][]>(Array(2).fill([]).map(() => []));

    const handlePeopleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const count = Math.min(parseInt(e.target.value, 10), maxPeople);
        setPeople(count);
        setOrders(prevOrders => {
            const newOrders = Array(count).fill([]).map((_, i) => prevOrders[i] || []);
            return newOrders;
        });
    };

    const handlePPNChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setCustomPPN(parseFloat(e.target.value || "0"));

    const handleExtraCostChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setExtraCost(parseFloat(e.target.value || "0"));

    const addOrder = (personIndex: number) => {
        setOrders(prevOrders => {
            const newOrders = [...prevOrders];
            newOrders[personIndex] = [...newOrders[personIndex], { name: "", price: "" }];
            return newOrders;
        });
    };

    const formatCurrency = (value: string) => {
        return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleOrderChange = (
        personIndex: number,
        orderIndex: number,
        field: keyof Order,
        value: string
    ) => {
        setOrders(prevOrders => {
            const newOrders = [...prevOrders];
            newOrders[personIndex][orderIndex] = {
                ...newOrders[personIndex][orderIndex],
                [field]: field === "price" ? formatCurrency(value) : value,
            };
            return newOrders;
        });
    };

    const totalPerPerson = orders.map(personOrders =>
        personOrders.reduce((sum, order) => sum + (parseFloat(order.price.replace(/\./g, "")) || 0), 0)
    );

    const totalValue = totalPerPerson.reduce((sum, value) => sum + value, 0);
    const totalPPN = Math.round((totalValue * customPPN) / 100);
    const extraCostValue = Math.round(extraCost);
    const finalTotal = totalValue + totalPPN + extraCostValue;

    return (
        <div className="container">
            <div className="card">
                <h1 className="title">Kalkulator Patungan Makanan</h1>
                <label>Pajak (%)</label>
                <input
                    type="text"
                    value={customPPN}
                    onChange={handlePPNChange}
                    className="input full-width"
                />

                <label>Biaya Lain-lain (Opsional)</label>
                <input
                    type="text"
                    value={extraCost}
                    onChange={handleExtraCostChange}
                    className="input full-width"
                />

                <label>Jumlah Orang</label>
                <select value={people} onChange={handlePeopleChange} className="input full-width">
                    {[...Array(maxPeople - 1).keys()].map(i => (
                        <option key={i + 2} value={i + 2}>{i + 2}</option>
                    ))}
                </select>

                <h3>Pesanan</h3>
                {orders.map((personOrders, personIndex) => (
                    <div key={personIndex} className="person-orders">
                        <h4>Orang {personIndex + 1}</h4>
                        {personOrders.map((order, orderIndex) => (
                            <div key={orderIndex} className="order-item">
                                <input
                                    type="text"
                                    placeholder="Nama Pesanan"
                                    value={order.name}
                                    onChange={(e) => handleOrderChange(personIndex, orderIndex, "name", e.target.value)}
                                    className="input"
                                />
                                <input
                                    type="text"
                                    placeholder="Harga"
                                    value={order.price}
                                    onChange={(e) => handleOrderChange(personIndex, orderIndex, "price", e.target.value)}
                                    className="input"
                                    inputMode="numeric"
                                />
                            </div>
                        ))}
                        <button onClick={() => addOrder(personIndex)} className="add-button">+ Tambah Pesanan</button>
                        <p className="result">Total Orang {personIndex + 1}: Rp {formatCurrency((totalPerPerson[personIndex] + (totalPerPerson[personIndex] * customPPN) / 100).toFixed(0))}</p>
                        <hr />
                    </div>
                ))}

                <p className="result">Total Semua Pesanan: Rp {formatCurrency(totalValue.toFixed(0))}</p>
                <p className="result">Total PPN ({customPPN}%): Rp {formatCurrency(totalPPN.toFixed(0))}</p>
                <p className="result">Biaya Lain-lain: Rp {formatCurrency(extraCostValue.toFixed(0))}</p>
                <p className="result final">Total Akhir: Rp {formatCurrency(finalTotal.toFixed(0))}</p>
            </div>
        </div>
    );
}
