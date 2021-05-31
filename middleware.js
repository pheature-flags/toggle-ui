const path = require('path')

const getLastUrlItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
const post = req => {
    const url = req.url
    req.url = '/features'
    req.body = {
        id: getLastUrlItem(url),
        enabled: false,
        strategies: [],
    }
    return req
}
const setStrategy = req => {
    const db = require(path.join(__dirname, 'db.json'))

    const id = getLastUrlItem(req.url)

    let feature = db.features.find(feature => feature.id === id)
    const hasStrategy = feature.strategies ? feature.strategies.find(strategy => strategy.id === req.body.value.strategy_id) : false
    if (hasStrategy) {
        feature.strategies = feature.strategies.map(strategy => {
            if (req.body.value.strategy_id === strategy.id) {
                return {
                    id: strategy.id,
                    type: req.body.value.strategy_type,
                    segments: req.body.value.segments.map(segment => {
                        return {
                            id: segment.segment_id,
                            type: segment.segment_type,
                            criteria: segment.criteria,
                        }
                    })
                }
            }

            return strategy;
        })
    } else {
        feature.strategies.push({
            id: req.body.value.strategy_id,
            type: req.body.value.strategy_type,
            segments: req.body.value.segments.map(segment => {
                return {
                    id: segment.segment_id,
                    type: segment.segment_type,
                    criteria: segment.criteria,
                }
            })
        })
    }

    req.body = {
        strategies: feature.strategies
    }

    return req;
}
const removeStrategy = req => {
    const db = require(path.join(__dirname, 'db.json'))
    const id = getLastUrlItem(req.url)
    let feature = db.features.find(feature => feature.id === id)
    const strategy = feature.strategies.find(strategy => strategy.id === req.body.value.strategy_id)
    const index = feature.strategies.indexOf(strategy);
    if (index > -1) {
        feature.strategies.splice(index, 1);
    }
    req.body = {
        strategies: feature.strategies
    }

    return req;
}
const patch = req => {

    if ('enable_feature' === req.body.action) {
        req.body = {
            enabled: true
        }

        return req;
    }

    if ('disable_feature' === req.body.action) {
        req.body = {
            enabled: false
        }

        return req;
    }

    if ('set_strategy' === req.body.action) {
        return setStrategy(req)
    }

    if ('remove_strategy' === req.body.action) {
        return removeStrategy(req)
    }

    throw new Error('invalid action');
}

module.exports = (req, res, next) => {
    console.log(req.url)
    if (req.method === 'POST') {
        req = post(req)
    }
    if (req.method === 'PATCH') {
        req = patch(req)
        res.status(202)
    }

    // Continue to JSON Server router
    next()
}
