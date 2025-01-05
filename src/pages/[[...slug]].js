import React from 'react';
import { allContent } from '../utils/local-content';
import { getComponent } from '../components/components-registry';
import { resolveStaticProps } from '../utils/static-props-resolvers';
import { resolveStaticPaths } from '../utils/static-paths-resolvers';

function Page(props) {
    const { page, site } = props;
    const modelName = page?.__metadata?.modelName;
    if (!modelName) {
        throw new Error(`page has no type, page '${props.path}'`);
    }
    const PageLayout = getComponent(modelName);
    if (!PageLayout) {
        throw new Error(`no page layout matching the page model: ${modelName}`);
    }
    return <PageLayout page={page} site={site} />;
}

export function getStaticPaths() {
    const data = allContent();
    const paths = resolveStaticPaths(data);
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const data = allContent();
    const urlPath = '/' + (params.slug || []).join('/');
    const props = await resolveStaticProps(urlPath, data);
    // Quick fix for missing header/footer, suggested by copilot, to be reviewed
    // Ensure site.footer is not undefined
    if (props.site && props.site.footer === undefined) {
        props.site.footer = null;
    }
    // Ensure site.header is not undefined
    if (props.site && props.site.header === undefined) {
        props.site.header = null;
    }
    return { props };
}

export default Page;
