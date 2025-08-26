import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class AddColumn implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Add Column',
		name: 'addColumn',
		icon: 'file:AddColumn.svg',
		group: ['transform'],
		version: 1,
		description: 'Add a new column to the input data',
		defaults: {
			name: 'Add Column',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Column to Add',
				name: 'columnToAdd',
				placeholder: 'Enter Column Name',
				type: 'string',
				description: 'The name of the new column to add',
				default: '',
			},
			{
				displayName: 'Column Value',
				name: 'colValue',
				type: 'string',
				description: 'The column to use as the value for the new column',
				default: '',
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const columnToAdd = this.getNodeParameter('columnToAdd', 0) as string;
		const colValue = this.getNodeParameter('colValue', 0) as string;

		if (!items.length) {
			return [[]];
		}

		const result = items.map(item => {
			return {
				json: {
					...item.json,
					[columnToAdd]: colValue
				}
			};
		});

		return [result];
	}
}
