import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class PivotColumns implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pivot Columns',
		name: 'pivotColumns',
		icon: 'file:PivotColumns.svg',
		group: ['transform'],
		version: 1,
		description: 'Pivot columns in the input data',
		defaults: {
			name: 'Pivot Columns',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Columns to Pivot into new header',
				name: 'columnToPivot',
				placeholder: 'Remove Column to Remove',
				type: 'string',
				description: 'Remove Columns',
				default: '',
			},
			{
				displayName: 'Value Column',
				name: 'valueColumn',
				type: 'string',
				description: 'The column to use as the value for the pivoted data',
				default: '',
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const columnToPivot = this.getNodeParameter('columnToPivot', 0) as string;
		const valueColumn = this.getNodeParameter('valueColumn', 0) as string;

		if (!items.length) {
			return [[]];
		}

		// Get all column names from the first item
		const allColumns = Object.keys(items[0].json);

		// Group by columns (all columns except columnToPivot, valueColumn, and common identifier columns)
		const excludeFromGrouping = [columnToPivot, valueColumn, 'row_number', 'id', 'index', '_id'];
		const groupByColumns = allColumns.filter(col => !excludeFromGrouping.includes(col));

		// Get unique values from the column to pivot (convert to strings)
		const pivotValues = [...new Set(items.map(item => String(item.json[columnToPivot])))];

		// Group data by the groupBy columns
		const groups = new Map<string, any>();

		for (const item of items) {
			// Create a key from the groupBy columns (convert to strings)
			const groupKey = groupByColumns.map(col => String(item.json[col])).join('|');

			if (!groups.has(groupKey)) {
				// Initialize the group with the first occurrence
				const groupData: any = {};
				for (const col of groupByColumns) {
					groupData[col] = item.json[col];
				}
				// Initialize all pivot columns to null (or change to "" for empty string, 0 for zero)
				for (const pivotValue of pivotValues) {
					groupData[pivotValue] = null; // Change this to "" or 0 if preferred
				}
				groups.set(groupKey, groupData);
			}

			// Set the value for this pivot column (use first occurrence if duplicate)
			const group = groups.get(groupKey)!;
			const pivotColumnName = String(item.json[columnToPivot]);
			if (group[pivotColumnName] === null) {
				group[pivotColumnName] = item.json[valueColumn];
			}
		}

		// Convert groups back to result array
		const result = Array.from(groups.values()).map(groupData => ({
			json: groupData
		}));

		return [result];
	}
}
