import * as React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import './articles.css';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import Pagination from '../../components/Pagination/Pagination';
import { Input } from '../../components/Input/TextInput';
import Modal from '../../components/Modal/Modal';
import SearchIcon from '../../assets/icons/search';
import { Toast } from '../../components/utils/Utils';
import { Loading } from '../../components/Loading/loading';

export interface IUserData {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export type filterType = 'id' | 'userId' | 'title';

const PageSize = 6;
const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const [userData, setUserData] = React.useState<{ username: string }>();
  const [currPage, setCurrPage] = React.useState(1);
  const [listData, setListData] = React.useState<IUserData[]>([]);
  const [unTouchedList, setUntouchedList] = React.useState<IUserData[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterBy, setFilterBy] = React.useState<filterType>('title');
  const [isLoading, setIsloading] = React.useState<boolean>(false);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const [modalData, setModalData] = React.useState<{
    id?: number;
    title: string;
    body: string;
  }>({
    id: 0,
    title: '',
    body: '',
  });

  React.useEffect(() => {
    const session = sessionStorage.getItem('userData');
    if (session) {
      setUserData(JSON.parse(session));
    }
    setIsloading(true);

    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((data) => {
        const filtered = userId
          ? data.filter((item: IUserData) => item.userId.toString() === userId)
          : data;
        setListData(filtered);
        setUntouchedList(filtered);
        setIsloading(false);
      });
  }, [userId]);

  const saveData = async () => {
    const requestBody = {
      title: modalData.title,
      body: modalData.body,
      id: modalData.id ?? 0,
      userId: parseInt(userId ?? ''),
    };

    const url = isEditing
      ? `https://jsonplaceholder.typicode.com/posts/${modalData.id}`
      : 'https://jsonplaceholder.typicode.com/posts';
    const response = await fetch(url, {
      body: JSON.stringify(requestBody),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      method: isEditing ? 'PUT' : 'POST',
    });

    if (response.ok && !isEditing) {
      const responseBody = await response.json();
      const dData = listData;
      dData.unshift(responseBody);
      setListData(dData);
      setUntouchedList(dData);
      setOpenModal(false);
      Toast('success', 'Post created successfully!');
    }

    if (response.ok && isEditing) {
      const responseBody = await response.json();
      const dData = listData;

      const index = dData.findIndex((item) => item.id === responseBody.id);
      dData[index] = responseBody;
      setListData(dData);
      setUntouchedList(dData);
      setOpenModal(false);
      Toast('success', 'Post updated successfully!');
    }

    if (!response.ok) {
      Toast('error');
    }
  };

  const list = React.useMemo(() => {
    const firstPageIndex = (currPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;

    let dList: IUserData[] = unTouchedList;

    if (searchTerm.length > 0) {
      dList = unTouchedList.filter((item: IUserData) => {
        if (filterBy === 'title') {
          return item[`title`]
            .toLowerCase()
            .includes(searchTerm.toLocaleLowerCase());
        } else {
          return item[filterBy] === parseInt(searchTerm);
        }
      });
    }

    setListData(dList);
    return dList.slice(firstPageIndex, lastPageIndex);
  }, [unTouchedList, currPage, filterBy, searchTerm, openModal]);

  const onLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const onChangeSearchOption = (filterOption: filterType) => {
    setFilterBy(filterOption);
  };

  const onChangeSearchTerm = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchTerm(value);
  };

  const searchOptions = React.useMemo(() => {
    const initialFilter = [
      {
        name: 'id',
        onClick: onChangeSearchOption,
      },
      {
        name: 'title',
        onClick: onChangeSearchOption,
      },
    ];

    if (!userData) {
      initialFilter.push({
        name: 'userId',
        onClick: onChangeSearchOption,
      });
    }

    return initialFilter;
  }, [userData]);

  const onChange = (
    e:
      | React.FormEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setModalData((prevState) => ({
      title: name === 'title' ? value : prevState.title,
      body: name === 'body' ? value : prevState.body,
      id: prevState.id,
    }));
  };

  const onEdit = (post: IUserData) => {
    setOpenModal(true);
    setIsEditing(true);
    setModalData({
      id: post.id,
      title: post.title,
      body: post.body,
    });
  };

  const closeModal = () => {
    setModalData({
      id: 0,
      title: '',
      body: '',
    });
    setIsEditing(false);
    setOpenModal(false);
  };

  return (
    <>
      <div style={{ height: 'auto' }}>
        <div className="headerWrapper">
          <div className="articleTitle"> All Articles </div>
          {userData ? (
            <Button
              className="font-weight-600"
              caption={`Hello, ${userData.username}`}
              options={[
                {
                  name: 'Create New Post',
                  onClick: () => setOpenModal(true),
                },
                {
                  name: 'Logout',
                  onClick: onLogout,
                },
              ]}
            />
          ) : (
            <Button
              className="font-weight-600"
              caption="Login"
              onClick={() => navigate('/login')}
            />
          )}
        </div>
        <div className="landingPageWrapper">
          {/* Search  */}
          <div
            style={{
              display: 'flex',
            }}
          >
            <div style={{ marginRight: '20px' }}>
              <Input
                icon={<SearchIcon />}
                type="text"
                value={searchTerm}
                onChange={onChangeSearchTerm}
                placeholder="Search"
                className="searchFilter"
              />
            </div>

            <Button
              className="searchOption"
              caption={`${filterBy}`}
              options={searchOptions}
            />
          </div>

          {isLoading ? (
            <div className="loading-wrapper">
              <Loading />
            </div>
          ) : (
            <>
              {/* Main List */}
              <div className="articlesWrapper">
                {list &&
                  list.map((item: IUserData, index: number) => (
                    <Card
                      {...item}
                      key={`${item.id}-${index}`}
                      onEdit={userData ? () => onEdit(item) : undefined}
                    />
                  ))}
              </div>
              {/* Pagination */}
              <div>
                <Pagination
                  totalCount={listData.length}
                  currentPage={currPage}
                  pageSize={PageSize}
                  onPageChange={(currPage: number | string) =>
                    typeof currPage === 'number' && setCurrPage(currPage)
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={closeModal}
        renderButtons={[
          {
            caption: 'Cancel',
            onClick: closeModal,
            className: 'modal-btn',
          },
          {
            caption: 'Save',
            onClick: saveData,
            className: 'modal-btn',
          },
        ]}
      >
        <div style={{ padding: '0px 25px' }}>
          <h2 className="modal-header">
            {isEditing ? `Edit Post ${modalData.id}` : 'Create New Post'}
          </h2>
          <div className="input-wrapper">
            <Input
              type="text"
              value={modalData.title}
              onChange={onChange}
              placeholder="Title"
              name="title"
            />
          </div>
          <div className="input-wrapper">
            <textarea
              className="text-area"
              value={modalData.body}
              onChange={onChange}
              name="body"
              placeholder="Body"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
