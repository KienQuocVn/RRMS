import { Box, Container, Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BannerHorizontal from '~/components/BannerHorizontal';
import LoadingPage from '~/components/LoadingPage/LoadingPage';
import { getAccountByUsername, introspect } from '~/apis/accountAPI';
import { getBulletinBoard } from '~/apis/bulletinBoardAPI';
import { searchByName } from '~/apis/searchAPI';
import { findProvinceFromAddress, loadProvinces } from '~/utils/findProvince';
import DetailBreadcrumbs from './sections/DetailBreadcrumbs';
import DetailContactSection from './sections/DetailContactSection';
import DetailDescriptionSection from './sections/DetailDescriptionSection';
import DetailGallerySection from './sections/DetailGallerySection';
import DetailRelatedSection from './sections/DetailRelatedSection';
import DetailReviewSection from './sections/DetailReviewSection';
import DetailSummarySection from './sections/DetailSummarySection';

const Detail = ({ setIsAdmin }) => {
  const { t } = useTranslation();
  const { bulletinBoardId } = useParams();

  const [detail, setDetail] = useState(null);
  const [province, setProvince] = useState('');
  const [account, setAccount] = useState();
  const [roomOrder, setRoomOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(5);
  const [review, setReview] = useState({
    username: '',
    bulletinBoardId,
    rating: 1,
    content: '',
  });

  const loadDetailPage = useCallback(async () => {
    try {
      const bulletinBoardResponse = await getBulletinBoard(bulletinBoardId);
      const nextDetail = bulletinBoardResponse.result;

      setDetail(nextDetail);

      if (nextDetail?.address) {
        try {
          await loadProvinces();
          const provinceName = await findProvinceFromAddress(nextDetail.address);
          setProvince(provinceName || '');
          const relatedRoomsResponse = await searchByName(provinceName);
          setRoomOrder(relatedRoomsResponse?.data?.result || []);
        } catch (error) {
          console.error('Khong the tai danh sach phong lien quan:', error);
          setProvince('');
          setRoomOrder([]);
        }
      } else {
        setProvince('');
        setRoomOrder([]);
      }
    } catch (error) {
      console.error('Khong the tai chi tiet tin dang:', error);
    }

    try {
      const introspectResponse = await introspect();
      if (!introspectResponse?.issuer) {
        setAccount(undefined);
        return;
      }

      const accountResponse = await getAccountByUsername(introspectResponse.issuer);
      setAccount(accountResponse ?? undefined);
    } catch {
      setAccount(undefined);
    }
  }, [bulletinBoardId]);

  useEffect(() => {
    setIsAdmin(false);
    window.scrollTo(0, 0);
    setCurrentPage(1);
    setReview({
      username: '',
      bulletinBoardId,
      rating: 1,
      content: '',
    });
    loadDetailPage();
  }, [bulletinBoardId, loadDetailPage, setIsAdmin]);

  useEffect(() => {
    setReview((prev) => ({
      ...prev,
      username: account?.username || '',
    }));
  }, [account?.username]);

  if (!detail) {
    return <LoadingPage />;
  }

  const reviews = detail?.bulletinBoardReviews || [];
  const roomRating =
    reviews.length > 0
      ? Number((reviews.reduce((total, item) => total + item.rating, 0) / reviews.length).toFixed(2))
      : 0;
  const totalReviewPages = Math.ceil(reviews.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = reviews.slice(indexOfFirstComment, indexOfLastComment);

  const refreshBulletinBoards = () => {
    loadDetailPage();
  };

  const handlePaginate = (event, value) => {
    setCurrentPage(value);
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: detail.title,
          text: detail.name,
          url: currentUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(currentUrl);
      toast.success('Da sao chep lien ket tin dang');
    } catch (error) {
      console.error(error);
    }
  };

  const handleShareFacebook = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDescription = async () => {
    try {
      await navigator.clipboard.writeText(detail.description || '');
      toast.success('Da sao chep mo ta');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveForLater = () => {
    toast.info('Tinh nang luu xem sau se duoc bo sung sau');
  };

  return (
    <Box
      sx={{
        py: { xs: 2, md: 4 },
        background:
          'linear-gradient(180deg, rgba(25,118,210,0.08) 0%, rgba(255,255,255,0.95) 20%, rgba(255,255,255,1) 100%)',
      }}>
      <Container maxWidth="lg">
        <DetailBreadcrumbs title={detail.title} province={province} category={detail.rentalCategory} homeLabel={t('trang-chu')} />

        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              <DetailGallerySection images={detail.bulletinBoardImages || []} address={detail.address} title={detail.title} />

              <DetailSummarySection detail={detail} rating={roomRating} />

              <DetailDescriptionSection
                description={detail.description}
                onCopyDescription={handleCopyDescription}
                onSaveForLater={handleSaveForLater}
                onShare={handleShare}
                onShareFacebook={handleShareFacebook}
              />

              <BannerHorizontal />

              <DetailReviewSection
                account={account}
                bulletinBoardId={bulletinBoardId}
                comments={currentComments}
                currentPage={currentPage}
                onPageChange={handlePaginate}
                refreshBulletinBoards={refreshBulletinBoards}
                review={review}
                reviews={reviews}
                roomRating={roomRating}
                setReview={setReview}
                totalPages={totalReviewPages}
              />

              <DetailRelatedSection
                currentBulletinBoardId={detail.bulletinBoardId}
                items={roomOrder}
                province={province}
                rentalCategory={detail.rentalCategory}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <DetailContactSection item={detail} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Detail;
