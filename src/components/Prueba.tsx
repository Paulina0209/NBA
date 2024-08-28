import React, { useState, useEffect } from "react";

interface Jugador {
    first_name: string;
    last_name: string;
    h_in: string;
}

export const Prueba: React.FC = () => {
    const [jugadores, setJugadores] = useState<Jugador[]>([]);
    const [resultado, setResultado] = useState<string[]>([]);
    const [input, setInput] = useState<number | ''>('');

    const obtenerJugadores = async () => {
        const respuesta = await fetch('https://mach-eight.uc.r.appspot.com/');
        const datos = await respuesta.json();
        const { values } = datos;
        setJugadores(values);
    };

    const alturasSuma = (altura: number): string[] => {
        const resultado: string[] = [];
        const mapaAlturas = new Map<number, string>(); 

        for (const jugador of jugadores) {
            const alturaJugador = parseInt(jugador.h_in);
            const diferencia = altura - alturaJugador;

            if (mapaAlturas.has(diferencia)) {
                const otroJugador = mapaAlturas.get(diferencia);
                if (otroJugador) {
                    resultado.push(`${otroJugador} y ${jugador.first_name} ${jugador.last_name}`);
                }
            }

            mapaAlturas.set(alturaJugador, `${jugador.first_name} ${jugador.last_name}`);
        }

        return resultado.length > 0 ? resultado : ["No matches found"];
    };

    const manejarCambioAltura = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        const altura = parseInt(valor);
        setInput(altura);
        if (!isNaN(altura)) {
            setResultado(alturasSuma(altura));
        } else {
            setResultado([]);
        }
    };

    useEffect(() => {
        obtenerJugadores();
    }, []);

    return (
        <div>
            <input
                type="number"
                placeholder="Ingrese la suma de las alturas"
                value={input}
                onChange={manejarCambioAltura}
            />
            <ul>
                {resultado.map((nombre, index) => (
                    <li key={index}>{nombre}</li>
                ))}
            </ul>
        </div>
    );
};