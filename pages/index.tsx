import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/bitcoin-btc/tether-usdt-usdt',
      permanent: false,
    },
  };
};

export default function ConverterIndex() {
  return null;
} 