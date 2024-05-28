import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { database } from "../components/firebase";
import { ref, set, onValue, remove, update } from "firebase/database";
import { Modal, Button } from "react-bootstrap";
import DndContext from "../context/DndContext";
import FooterView from "../sections/FooterView";

const initialMaterials = [
    "GP03", "LLD",
    "REG100", "REG200", "REG300", "REG400", "REG500", "REG700", "REGX",      //REG
    "6230", "3450", "1350", "4466", "6244", "0201", "0201FX", "2350", "1810",
    "A-Pall", "B-Pall", //Pall
];

const machines = {
    E01: ["A1", "B1", "A2", "B2", "IN"],
    E04: ["1", "2", "3", "IN"],
    E06: ["1", "2", "3", "IN"],
    E07: ["A", "B", "C", "A1", "B1", "C1", "IN"],
    E08: ["IN"],
    E09: ["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3", "IN"],
    E10: ["A1", "B1", "A2", "B2", "IN"],
    E13: ["A", "A1", "A2", "B", "B1", "B2"],
};

const urgencyOptions = ["ASAP", "om 15 min", "om 30 min", "om 1 timme", "om 2 timme"];

const WishPage = () => {
    const [wish, setWish] = useState("");
    const [materials, setMaterials] = useState(initialMaterials);
    const [searchTerm, setSearchTerm] = useState("");
    const [newMaterial, setNewMaterial] = useState("");
    const [machineWishes, setMachineWishes] = useState({});
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [selectedPipe, setSelectedPipe] = useState(null);
    const [showUrgencyModal, setShowUrgencyModal] = useState(false);
    const [selectedUrgency, setSelectedUrgency] = useState("ASAP");

    useEffect(() => {
        const wishesRef = ref(database, 'wishes');
        onValue(wishesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const wishes = Object.entries(data).map(([id, wish]) => ({ id, ...wish }));
                const updatedMachineWishes = {};
                wishes.forEach(wish => {
                    const key = `${wish.machine}_${wish.pipe}`;
                    if (!updatedMachineWishes[key]) {
                        updatedMachineWishes[key] = [];
                    }
                    updatedMachineWishes[key].push(wish);
                });
                setMachineWishes(updatedMachineWishes);
            } else {
                setMachineWishes({});
            }
        });
    }, []);

    const handleDrag = (material) => {
        setWish(material);
    };

    const handleDrop = (machine, pipe) => {
        setSelectedMachine(machine);
        setSelectedPipe(pipe);
        setShowUrgencyModal(true);
    };

    const handleUrgencySelect = () => {
        const timestamp = new Date().toISOString();
        const newWish = { material: wish, machine: selectedMachine, pipe: selectedPipe, urgency: selectedUrgency, timestamp };
        const wishRef = ref(database, 'wishes/' + Date.now());
        set(wishRef, newWish);
        setWish("");
        setShowUrgencyModal(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInsert = () => {
        if (newMaterial && !materials.includes(newMaterial)) {
            setMaterials([...materials, newMaterial]);
            setNewMaterial("");
        }
    };

    const handleDelete = (wishId) => {
        const wishRef = ref(database, `wishes/${wishId}`);
        remove(wishRef);
    };

    const handleUrgencyChange = (wishId, newUrgency) => {
        const wishRef = ref(database, `wishes/${wishId}`);
        update(wishRef, { urgency: newUrgency });
    };

    const filteredMaterials = materials.filter(material =>
        material.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const Material = ({ material }) => {
        const [, drag] = useDrag(() => ({
            type: "MATERIAL",
            item: { material },
        }));

        return (
            <div ref={drag} className="drag-box-item">
                {material}
            </div>
        );
    };

    const Pipe = ({ machine, pipe }) => {
        const [, drop] = useDrop(() => ({
            accept: "MATERIAL",
            drop: () => handleDrop(machine, pipe),
        }));

        return (
            <li ref={drop} className="pipe">
                <h5 className="pipe-number">{pipe}</h5>
                <ul>
                    {(machineWishes[`${machine}_${pipe}`] || []).map(wish => (
                        <li key={wish.id} className="wish-item">
                            <div className="wish-item-info">
                                <h4>{wish.material} </h4>
                                <select value={wish.urgency} onChange={(e) => handleUrgencyChange(wish.id, e.target.value)}>
                                    {urgencyOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <h6>{formatTimestamp(wish.timestamp)}</h6>
                            </div>
                            <button onClick={() => handleDelete(wish.id)} className="delete-button"><i className="fa-solid fa-xmark"></i></button>
                        </li>
                    ))}
                </ul>
            </li>
        );
    };

    return (
        <DndContext>
            <div className="container">
                <h1>TILLÖNSKAN</h1>

                <div className="machines">
                    {Object.entries(machines).map(([machine, pipes]) => (
                        <div key={machine} className="machine" >
                            <h3 type="button" data-bs-toggle="collapse" data-bs-target={`#${machine}`} aria-controls={machine}>{machine}</h3>
                            <div className="collapse" id={machine}>
                                <div className="drag-drop-container">
                                    <div className="drag-box">
                                        <input type="text" placeholder="Sök material..." value={searchTerm} onChange={handleSearch} />
                                        <input type="text" placeholder="Lägg till nytt material..." value={newMaterial} onChange={(e) => setNewMaterial(e.target.value)} />
                                        <button onClick={handleInsert} style={{ marginBottom: "20px" }}>Lägg Till</button>

                                        <div className="drag-box-items">
                                            {filteredMaterials.map((material, index) => (
                                                <Material key={material} material={material} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="line"></div>
                                    <ul className="drop-box">
                                        {pipes.map(pipe => (
                                            <Pipe key={pipe} machine={machine} pipe={pipe} />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal show={showUrgencyModal} onHide={() => setShowUrgencyModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Välj Brådskande</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <select value={selectedUrgency} onChange={(e) => setSelectedUrgency(e.target.value)}>
                            {urgencyOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUrgencyModal(false)}>Avbryt</Button>
                        <Button variant="primary" onClick={handleUrgencySelect}>Bekräfta</Button>
                    </Modal.Footer>
                </Modal>

                <FooterView />
            </div>
        </DndContext>
    );
};

export default WishPage;
