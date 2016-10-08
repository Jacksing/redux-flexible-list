import React, {PropTypes} from 'react'

import Head from './Head'
import Row from './Row'
import DetailRow from './DetailRow'

import warning from '../../utils/warning'

import './styles/grid.css'

const Grid = ({rows, header, preExpander, widgets}) => {
    let index = 0
    let rowElements = []

    let hasCascadeRow = rows.filter(row => !Array.isArray(row)).length > 0

    // let widgets = {
    //     1: {
    //         'class': 'text-right',
    //     },
    //     4: {
    //         'class': 'text-right',
    //     },
    // }

    let indexedWidgets = {}
    for (let name in widgets) {
        index = header.indexOf(name)
        if (index != -1) indexedWidgets[index] = widgets[name]
    }

    rows.forEach(row => {
        if (Array.isArray(row)) {
            rowElements.push(
                <Row
                    key={index++}
                    cells={row}
                    cascaded={false}
                    hasCascadedSibling={hasCascadeRow}
                    preExpander={preExpander}
                    widgets={indexedWidgets}
                />
            )
        } else {
            rowElements.push(
                <Row
                    key={index++}
                    cells={row.primary}
                    cascaded={true}
                    preExpander={preExpander}
                    widgets={indexedWidgets}
                />
            )

            if (Array.isArray(row.details)) {
                rowElements.push(
                    <DetailRow
                        key={index++}
                        rows={row.details}
                        header={header}
                        preExpander={preExpander}
                        widgets={widgets}
                    />
                )
            } else {
                // Here, {row.details} should be an object which contains header information itself.
                // A `rows` property of {row.details} should also be applied here.
                warning(row.details.rows !== undefined, 'Cannot find prop `rows` of `row.details`. Please check the original data.')
                rowElements.push(
                    <DetailRow
                        key={index++}
                        rows={row.details.rows}
                        header={row.details.header}
                        preExpander={preExpander}
                        widgets={widgets}
                    />
                )
            }
        }
    })

    let headerElements = null

    if (header)
        headerElements = <thead><Head cells={header} cascadable={hasCascadeRow} preExpander={preExpander} /></thead>

    return (
        <table className="cascadegrid bordered -single-head">
            {headerElements}
            <tbody>{rowElements}</tbody>
        </table>
    )
}

Grid.propTypes = {
    rows: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ])
    ),
    header: PropTypes.arrayOf(
        PropTypes.string
    ),
    preExpander: PropTypes.bool,
    widgets: PropTypes.objectOf(PropTypes.object),
}

export default Grid