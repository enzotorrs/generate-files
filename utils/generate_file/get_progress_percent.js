function getProgressPercent(dataString, size) {
    const bytes = dataString.split(' ')[0]
    const target = 1048576 * size
    const percent = Number(bytes) / target * 100
    const percentTrunc = Math.trunc(percent)
    return percentTrunc
}

module.exports = { getProgressPercent }
