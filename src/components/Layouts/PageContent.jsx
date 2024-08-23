import React from "react";

function PageContent({ children }) {
  return (
    <main className="px-4 w-full md:px-6 py-4 md:py-6 space-y-4 max-w-full overflow-x-hidden">
      {children}
    </main>
  );
}

export default PageContent;
