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
    const [modalVisible, setModalVisible] = useState(false);
    const [orderName, setOrderName] = useState("");
    const [orderPrice, setOrderPrice] = useState("");
    const [selectedPeople, setSelectedPeople] = useState<boolean[]>(Array(10).fill(false));

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

    const handleExtraCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = e.target.value.replace(/\D/g, "");
        setExtraCost(parseFloat(formattedValue || "0"));
    };

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

    // Modal functionality to add orders
    const handleAddToSelectedPeople = () => {
        const newOrders = [...orders];
        selectedPeople.forEach((isSelected, index) => {
            if (isSelected) {
                newOrders[index] = [...newOrders[index], { name: orderName, price: orderPrice }];
            }
        });
        setOrders(newOrders);
        setModalVisible(false);
    };

    function handleReset() {
        setPeople(2);
        setCustomPPN(11);
        setExtraCost(0);
        setOrders(Array(2).fill([]).map(() => []));
    }

    return (
        <div className="container">
            <div className="card">
                <h1 className="title">Kalkulator Patungan</h1>
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
                    value={formatCurrency(extraCost.toString())}
                    onChange={handleExtraCostChange}
                    className="input full-width"
                    inputMode="numeric"
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

                <button className="add-order-button" onClick={() => setModalVisible(true)}>
                    + Tambah Pesanan ke Semua Orang
                </button>
                <button className="reset-button modern" onClick={handleReset}>Reset</button>

                {/* Modal Box */}
                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Tambah Pesanan</h3>
                            <label>Nama Pesanan</label>
                            <input
                                type="text"
                                value={orderName}
                                onChange={(e) => setOrderName(e.target.value)}
                                className="input"
                            />
                            <label>Harga</label>
                            <input
                                type="text"
                                value={formatCurrency(orderPrice)}
                                onChange={(e) => setOrderPrice(e.target.value)}
                                className="input"
                                inputMode="numeric"
                            />
                            <label>Pesanan Dikirim ke</label>
                            <div>
                                {orders.map((_, index) => (
                                    <div key={index} className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={selectedPeople[index]}
                                            onChange={() => {
                                                const newSelectedPeople = [...selectedPeople];
                                                newSelectedPeople[index] = !newSelectedPeople[index];
                                                setSelectedPeople(newSelectedPeople);
                                            }}
                                        />
                                        <span>Orang {index + 1}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="button-container">
                                <button onClick={handleAddToSelectedPeople} className="add-button">Tambah Pesanan</button>
                                <button onClick={() => setModalVisible(false)} className="cancel-button">Batal</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
