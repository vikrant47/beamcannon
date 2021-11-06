import Sequelize, {DataTypes} from "sequelize";
import {FsSlack} from "../../../modules/services/databases/fs/fs.slack";

export const Models = {
    BEAM_TUNNELS: 'beam_tunnels',
}
export const ModelDefinitions = {
    [Models.BEAM_TUNNELS]: {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        connection_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false
        },
        protocol: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        updated_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    }
}
export const registerModels = () => {
    const slack = new FsSlack(null);
    const Tunnels = slack.registerModel(Models.BEAM_TUNNELS, ModelDefinitions[Models.BEAM_TUNNELS]);
}
