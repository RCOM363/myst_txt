"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [showMoreFrom, setShowMoreFrom] = useState<number | null>(null);

  useEffect(() => {
    if (
      currentPage > 10 &&
      (!showMoreFrom ||
        currentPage < showMoreFrom ||
        currentPage > showMoreFrom + 9)
    ) {
      const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
      setShowMoreFrom(startPage);
    } else if (currentPage <= 10) {
      setShowMoreFrom(null);
    }
  }, [currentPage, showMoreFrom]);

  const getPageNumbers = (): number[] => {
    let pages: number[] = [];

    if (totalPages <= 10) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (!showMoreFrom) {
        pages = Array.from({ length: 10 }, (_, i) => i + 1);
      } else {
        const remainingPages = totalPages - showMoreFrom + 1;
        const length = Math.min(10, remainingPages);
        pages = Array.from({ length }, (_, i) => showMoreFrom + i);
      }
    }
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLoadMore = (lastVisiblePage: number) => {
    const nextStartPage = lastVisiblePage + 1;
    setShowMoreFrom(nextStartPage);
    onPageChange(nextStartPage);
  };

  const pageNumbers = getPageNumbers();
  const showLoadMore =
    totalPages > 10 && (!showMoreFrom || showMoreFrom + 9 < totalPages);

  return (
    <nav className=" h-5 flex items-center justify-center space-x-2 mt-5">
      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="h-8 w-8 flex items-center justify-center border-[#8a2be2] border-[2px] hover:bg-[#7424c9] text-[#8a2be2] hover:text-white rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`h-8 w-8 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-300 ease-in-out ${
                  currentPage === pageNumber
                    ? "bg-[#8a2be2] text-white hover:bg-[#7424c9]"
                    : ""
                }`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            {showLoadMore && (
              <>
                <span className="px-2">...</span>
                <button
                  className="h-8"
                  onClick={() =>
                    handleLoadMore(pageNumbers[pageNumbers.length - 1])
                  }
                >
                  Load More
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="h-8 w-8 flex items-center justify-center border-[#8a2be2] border-[2px] hover:bg-[#7424c9] text-[#8a2be2] hover:text-white rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </nav>
  );
};

export default Pagination;
