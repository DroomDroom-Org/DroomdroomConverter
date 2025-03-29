import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/converter/btc/usdt',
      permanent: false,
    },
  };
};

export default function ConverterIndex() {
  return null;
} 