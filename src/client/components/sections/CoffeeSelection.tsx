import BigNumber from 'bignumber.js';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { usePayment } from '../../hooks/usePayment';
import css from './CoffeeSelection.module.css';

export const CoffeeSelection: FC = () => {
    const [value, setValue] = useState('0');

    const { setAmount } = usePayment();
    useEffect(() => setAmount(value ? new BigNumber(value) : undefined), [setAmount, value]);

    interface Coffee {
        idx: number;
        name: string;
        unit_price: number;
        quantity: number;
    }

    const initialCoffee: Coffee[] = [
        { idx: 0, name: 'Americano', unit_price: 3, quantity: 0 },
        { idx: 1, name: 'Brewed Coffee', unit_price: 3.333, quantity: 0 },
        { idx: 2, name: 'Cappuccino', unit_price: 3.475, quantity: 0 },
        { idx: 3, name: 'Latte', unit_price: 3.352, quantity: 0 },
        { idx: 4, name: 'Espresso', unit_price: 3.422, quantity: 0 },
    ];

    const DOLA_TO_SOL = 0.0074; // @ 12/09/2024

    const [coffees, setCoffee] = useState<Coffee[]>(initialCoffee);
    const updateQuantity = (idx: number, newQuantity: number) => {
        setCoffee((prevCoffee) =>
            prevCoffee.map((coffee) => (coffee.idx === idx ? { ...coffee, quantity: newQuantity } : coffee))
        );
    };

    useEffect(() => {
        const totalPrice = coffees.reduce((sum, coffee) => sum + coffee.unit_price * coffee.quantity, 0);
        setAmount(new BigNumber(totalPrice * DOLA_TO_SOL));
    }, [coffees, setAmount]);

    const onMinus = (idx: number) => {
        let qty = coffees[idx].quantity;
        if (qty > 0) {
            updateQuantity(idx, qty - 1);
        }
    };

    const onPlus = (idx: number) => {
        let qty = coffees[idx].quantity;
        if (qty < 10) {
            updateQuantity(idx, qty + 1);
        }
    };

    return (
        <div className={css.root}>
            <div className={css.textTitle}>Select the coffee items that you have ordered.</div>
            <div>
                <hr />
            </div>
            <div>&nbsp;</div>

            <div className={css.tableContainer}>
                <table className={css.table}>
                    <tbody>
                        {coffees.map((coffee) => (
                            <tr key={coffee.idx} className={css.tableRow}>
                                <td className={css.tableData}>{coffee.name}</td>
                                <td className={css.tableData}>{coffee.unit_price}&nbsp;$</td>
                                <td className={css.tableData}>
                                    <button
                                        style={{
                                            cursor: 'pointer',
                                            color: 'red',
                                        }}
                                        className={css.plusminus}
                                        onClick={() => onMinus(coffee.idx)}
                                    >
                                        -
                                    </button>
                                </td>
                                <td className={css.tableData}>{coffee.quantity}</td>
                                <td className={css.tableData}>
                                    <button
                                        style={{
                                            cursor: 'pointer',
                                            color: 'red',
                                        }}
                                        className={css.plusminus}
                                        onClick={() => onPlus(coffee.idx)}
                                    >
                                        +
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
