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
import PageWrapper from './PageWrapper'
import BaseDialog from './BaseDialog'
import DataTable from './DataTable'
import IconSpriteSheet from './IconSpriteSheet'
import OutlinedOverviewCard from './OutlinedOverviewCard'
import TreeData from './TreeData'
import Collapse from './Collapse'
import ConfirmDialog from './ConfirmDialog'
import SelectDialog from './SelectDialog'
import ParameterInput from './ParameterInput'
import LineChart from './LineChart.vue'
import GlobalSearch from './GlobalSearch'
import CreateResource from './CreateResource'

import DetailsParametersCollapse from './DetailsPage/DetailsParametersCollapse'
import DetailsPageTitle from './DetailsPage/DetailsPageTitle'
import DetailsIconGroupWrapper from './DetailsPage/DetailsIconGroupWrapper'

export default {
    'page-wrapper': PageWrapper,

    'global-search': GlobalSearch,
    'create-resource': CreateResource,

    'base-dialog': BaseDialog,
    'data-table': DataTable,
    'icon-sprite-sheet': IconSpriteSheet,
    'outlined-overview-card': OutlinedOverviewCard,
    'tree-data': TreeData,
    collapse: Collapse,

    'confirm-dialog': ConfirmDialog,
    'select-dialog': SelectDialog,
    'parameter-input': ParameterInput,
    'line-chart': LineChart,

    'details-parameters-collapse': DetailsParametersCollapse,
    'details-page-title': DetailsPageTitle,
    'details-icon-group-wrapper': DetailsIconGroupWrapper,
}
