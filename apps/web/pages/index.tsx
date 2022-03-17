import Pricing from "@/components/Pricing";
import Layout from "components/Layout";
import fetcher from "lib/fetcher";
import { InferGetStaticPropsType } from "next";

export default function Index({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Pricing products={products} />
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const products = await fetcher(
      `${process.env.API_BASE_URL}/apis/main/products`
    );

    return {
      props: {
        products,
      },
      revalidate: 50,
    };
  } catch (e) {
    return {
      props: {
        products: [],
      },
    };
  }
}
