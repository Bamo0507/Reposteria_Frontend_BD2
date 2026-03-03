"use client"

import { IconChevronDown } from "@tabler/icons-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  pageSizeOptions?: number[]
  onPageSizeChange: (size: number) => void
  total: number
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  total,
}: PaginationControlsProps) {
  const showAll = totalPages <= 5

  const handlePageSizeChange = (size: number) => {
    onPageSizeChange(size)
    onPageChange(1)
  }

  return (
    <div className="mt-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2">
      {/* Left: total count */}
      <div className="flex items-center text-sm text-muted-foreground w-full xl:w-1/3 order-0 xl:order-none">
        {total > 0 && (
          <span>
            {total} resultado{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Center: page buttons */}
      <div className="flex w-full justify-end xl:justify-center xl:w-1/3 order-2 xl:order-none">
        <Pagination className="mx-0 justify-end xl:justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {/* First page */}
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === 1}
                onClick={() => onPageChange(1)}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>

            {/* Left ellipsis */}
            {!showAll && currentPage >= 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Middle pages */}
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1
              if (page === 1 || page === totalPages) return null
              const inRange = page >= currentPage - 1 && page <= currentPage + 1
              if (!showAll && !inRange) return null
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {/* Right ellipsis */}
            {!showAll && currentPage <= totalPages - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last page */}
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  isActive={currentPage === totalPages}
                  onClick={() => onPageChange(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Right: page size selector */}
      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground w-full xl:w-1/3 order-1 xl:order-none">
        <span className="font-medium">Filas:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-20 inline-flex items-center justify-between px-2 rounded-md border border-input bg-background text-sm">
              {pageSize}
              <IconChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-20 p-1">
            {pageSizeOptions.map((size) => (
              <DropdownMenuItem key={size} onSelect={() => handlePageSizeChange(size)}>
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
