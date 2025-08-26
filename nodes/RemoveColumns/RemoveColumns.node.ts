import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	// IDataObject,
} from 'n8n-workflow';

export class RemoveColumns implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Remove Columns',
		name: 'removeColumns',
		icon: 'file:RemoveColumn.svg',
		group: ['transform'],
		version: 1,
		description: 'Remove columns from the input data',
		defaults: {
			name: 'Remove Columns',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Columns to Remove',
				name: 'columns',
				placeholder: 'Remove Column to Remove',
				type: 'fixedCollection',
				noDataExpression: true,
				typeOptions: {
					multipleValues: true,
					sortable: true,
				},
				description: 'Remove Columns',
				default: {},
				options: [
					{
						name: 'columns',
						displayName: 'Columns to Remove',
						values: [
							{
								displayName: 'Column Name',
								name: 'column',
								type: 'string',
								default: 'Column to remove',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const columns = this.getNodeParameter('columns', 0) as { columns: { column: string }[] };
		// console.log(columns);
		// console.log(items);

		let result = [];

		for (const item of items) {
			const newItem = {
				...item,
				json: { ...item.json }
			};
			for (const col of columns.columns) {
				delete newItem.json[col.column];
			}
			result.push(newItem);
		}

		return [result];
	}
}
