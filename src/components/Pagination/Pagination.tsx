import { usePagination, DOTS } from '../../Hooks/CustomHooks';
import { Arrow } from '../../assets/icons/arrow';
import './Pagination.css';

interface IPaginationProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (nextPage: number | string) => void;
}

const Pagination = (props: IPaginationProps) => {
  const { onPageChange, totalCount, currentPage, pageSize } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount: 1,
    pageSize,
  });

  if (!paginationRange) {
    return null;
  }

  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className="pagination">
      <li>
        <button
          className="pager arrowLeft"
          disabled={currentPage === 1}
          onClick={onPrevious}
        >
          <Arrow />
        </button>
      </li>
      {paginationRange.map((pageNumber: number | string, index: number) => {
        if (pageNumber === DOTS) {
          return (
            <li key={`dots-${index}`}>
              <button className="pager"> {pageNumber} </button>
            </li>
          );
        }
        return (
          <li key={`${index}-item`}>
            <button
              className={`${
                pageNumber === currentPage ? 'activePage' : ''
              } pager`}
              onClick={() => onPageChange(pageNumber)}
            >
              {' '}
              {pageNumber}{' '}
            </button>
          </li>
        );
      })}
      <li>
        <button
          className="pager arrowRight"
          disabled={currentPage === lastPage}
          onClick={onNext}
        >
          <Arrow />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
