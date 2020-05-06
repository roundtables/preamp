const queryAllPages = function*(command, args) {
    const controlledCall = (arg) => {
        try {
            return command(arg)
        } catch (e) {
            console.error('failed command', command, arg)
            process.exit(1)
        }
    }
    let response = controlledCall(args)
    response = yield response
    if (!response.NextToken) {
        return response
    }
    while (!!(yield response).NextToken) {
        response = controlledCall({
            ...args,
            NextToken: response.NextToken
        })
        response = yield response
        yield response
    }
}

const fetchCloudFormationExports = async (SDK, requestedFields) => {
    const queryExports = async args => await SDK.listExports(args).promise()
    let returnExports = {}
    for (let exportBatch of queryAllPages(queryExports, {})) {
        const batch = await exportBatch
        for (let exported of batch.Exports) {
            if (requestedFields.includes(exported.Name)) {
                returnExports[exported.Name] = exported.Value
            }
        }
        if(!batch.NextToken) {
            break 
        }
    }
    return returnExports
}

const getCloudFormationExports = async (SDK, requestedFields) => {
    try {
        return await fetchCloudFormationExports(SDK, requestedFields)
    } catch (e) {
        console.error('Could not fetch cloudformation exports', e)
        process.exit(1)
    }
}

export { 
    getCloudFormationExports
}
