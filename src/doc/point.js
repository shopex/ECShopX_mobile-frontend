
import { formatDateTime, thousandthFormat } from '@/utils'
export const POINT_LIST_ITEM = {
  journalType: "journal_type_desc",
  outinType: 'outin_type',
  point: ({ point }) => thousandthFormat(point),
  orderId: 'order_id',
  created: ({ created }) => formatDateTime(created)
}