/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import BaseDialog from './BaseDialog'
import DataTable from './DataTable'
import SearchBox from 'components/common/SearchBox'
import DetailsPageTitle from './DetailsPageTitle'
import IconSpriteSheet from 'components/common/IconSpriteSheet'
import OutlineSmallCard from 'components/common/OutlineSmallCard'

import RecursiveTable from 'components/common/RecursiveTable'
import RecursiveNestedCollapse from 'components/common/RecursiveNestedCollapse'
import TreeData from 'components/common/TreeData'

export default {
    'base-dialog': BaseDialog,
    'data-table': DataTable,
    'search-box': SearchBox,
    'details-page-title': DetailsPageTitle,
    'icon-sprite-sheet': IconSpriteSheet,
    'outline-small-card': OutlineSmallCard,
    'recursive-table': RecursiveTable,
    'recursive-nested-collapse': RecursiveNestedCollapse,
    'tree-data': TreeData,
}
