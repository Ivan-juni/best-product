import * as React from 'react'
import { useTheme, styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import { ReactComponent as FirstPageIcon } from '../../../../../assets/icons/other/arrows/purple-arrow-last-left.svg'
import { ReactComponent as LastPageIcon } from '../../../../../assets/icons/other/arrows/purple-arrow-last-right.svg'
import { ReactComponent as KeyboardArrowLeft } from '../../../../../assets/icons/other/arrows/purple-arrow-left.svg'
import { ReactComponent as KeyboardArrowRight } from '../../../../../assets/icons/other/arrows/purple-arrow-right.svg'
import { IStats, StatsType } from '../../../../../models/IStats.model'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#766ED3',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }): any => ({
  '&:nth-of-type': {
    backgroundColor: 'transparent',
    color: '#000000',
  },
}))

interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  const { count, page, rowsPerPage, onPageChange } = props

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label='first page'>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label='next page'>
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label='last page'>
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

type PropsType = {
  stats: IStats
  options: {
    statisticOption: 'topViews' | 'topLikes' | 'topDislikes' | 'topFavoriteStars'
    statProperty: 'views' | 'likes' | 'dislikes' | 'favoriteStars'
    columnName: string
  }
}

const MostTable: React.FC<PropsType> = ({ stats, options }) => {
  const [data, setData] = React.useState<StatsType[]>([])

  React.useEffect(() => {
    if (stats[options.statisticOption]) {
      stats[options.statisticOption].forEach((stat) => {
        setData((prev) => [...prev, { id: stat.id, name: stat.name, [options.statProperty]: stat[options.statProperty] }])
      })

      data.sort((a, b) => {
        if (a[options.statProperty] != undefined && b[options.statProperty]) {
          //@ts-ignore
          return a[options.statProperty] < b[options.statProperty] ? 1 : -1
        }
        return 1
      })
    }
  }, [stats])

  const rows: StatsType[] = data

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label='custom pagination table'>
        <TableHead>
          <TableRow>
            <StyledTableCell align='center'>id</StyledTableCell>
            <StyledTableCell align='right'>Name</StyledTableCell>
            <StyledTableCell align='right'>{options.columnName}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row) => (
            <StyledTableRow key={row.name}>
              <TableCell style={{ width: '14%' }} component='th' scope='row' align='center'>
                {row.id}
              </TableCell>
              <TableCell style={{ width: '43%' }} align='right'>
                {row.name}
              </TableCell>
              <TableCell style={{ width: '43%' }} align='right'>
                {row[options.statProperty]}
              </TableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <StyledTableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <StyledTableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </StyledTableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default MostTable
