import { PageEditor } from "@/components/editor/page-editor";

export default function NewPagePage() {
  // Create a blank page object for new pages
  const blankPage = {
    _id: "new",
    title: "",
    slug: "",
    status: "draft" as const,
    blocks: [],
    seo: {
      metaTitle: "",
      metaDescription: "",
      slug: "",
      focusKeyword: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      noIndex: false,
      noFollow: false,
    },
    showInNavbar: true,
    navbarPosition: null,
    theme: "modern-breeder",
  };

  return <PageEditor page={blankPage} isNew />;
}

