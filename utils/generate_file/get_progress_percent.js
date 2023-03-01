function getProgressPercent(dataString, sizeInMegaByte) {
    const bytes = dataString.split(' ')[0]
    const sizeInBinaryByte = 1048576 * sizeInMegaByte
    const percent = Number(bytes) / sizeInBinaryByte * 100
    const percentTrunc = Math.trunc(percent)
    return isNaN(percentTrunc) ? 100 : percentTrunc
}

module.exports = { getProgressPercent }
