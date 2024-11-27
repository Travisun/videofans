import os from 'os'

/**
 * Get all available network interfaces and their addresses
 * Filters for IPv4 addresses and excludes internal/loopback interfaces
 * @returns {Array<{name: string, address: string}>} Array of network interfaces and their addresses
 */
export function networkInterfaces() {
    const interfaces = []
    const nets = os.networkInterfaces()

    // Process each network interface
    for (const name of Object.keys(nets)) {
        // Get addresses for this interface
        const networkAddresses = nets[name]

        for (const net of networkAddresses) {
            // Skip internal and non-IPv4 addresses
            if (!net.internal && net.family === 'IPv4') {
                interfaces.push({
                    name: name,
                    address: net.address
                })
            }
        }
    }

    // If no external interfaces found, add localhost
    if (interfaces.length === 0) {
        interfaces.push({
            name: 'localhost',
            address: '127.0.0.1'
        })
    }

    // Sort interfaces by name
    interfaces.sort((a, b) => a.name.localeCompare(b.name))

    return interfaces
}

/**
 * Format a list of network interfaces into a human-readable string
 * @param {Array<{name: string, address: string}>} interfaces Array of network interfaces
 * @param {number} port Server port number
 * @returns {string} Formatted string of network addresses
 */
export function formatNetworkAddresses(interfaces, port) {
    const lines = []

    lines.push('\nAvailable on:')
    for (const { name, address } of interfaces) {
        lines.push(`  > ${name}: http://${address}:${port}`)
    }

    return lines.join('\n')
}