/**
 * Universidad de La Laguna
 * Asignatura: Sistemas y Tecnologías Web
 * Proyecto Final SyTW
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Valerio Luis Cabrera   (alu0101476049@ull.edu.es)
 */

import { Request, Response } from 'express';
import { clienteModel } from '../models/cliente.js'

export const getClientes = async (req: Request, res: Response) => {
    try {
        let clientesEncontrados = await clienteModel.find(req.query);
        clientesEncontrados = clientesEncontrados.filter(x => x !== null);
        let condition: boolean = clientesEncontrados.length === 0;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró a los clientes' } : clientesEncontrados);
    } catch (error) {
        res.status(500).send({ msg: 'Error al buscar los clientes', error: error });
    }
}

export const getClientesID = async (req: Request, res: Response) => {
    try {
        let clienteEncontrado = await clienteModel.findOne({ id_: req.params.id });
        let condition: boolean = clienteEncontrado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al cliente' } : clienteEncontrado);
    } catch (error) {
        res.status(500).send({ msg: 'Error al buscar al cliente', error: error });
    }
}

export const postClientes = async (req: Request, res: Response) => {
    try {
        const cliente = new clienteModel(req.body);
        await cliente.save();
        res.send(cliente);
    } catch (error) {
        res.status(500).send({ msg: 'Error al guardar el cliente', error: error });
    }
}

export const patchClientesID = async (req: Request, res: Response) => {
    try {
        const clienteActualizado = await clienteModel.findOneAndUpdate({ id_: req.params.id }, req.body, { new: true, runValidators: true });
        let condition: boolean = clienteActualizado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al cliente' } : clienteActualizado);
    } catch (error) {
        res.status(500).send({ msg: 'Error al actualizar al cliente', error: error });
    }
}

export const deleteClientesID = async (req: Request, res: Response) => {
    try {
        const clienteEliminado = await clienteModel.findOneAndDelete({ id_: req.params.id });
        let condition: boolean = clienteEliminado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al cliente' } : clienteEliminado);
    } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar al cliente', error: error });
    }
}





