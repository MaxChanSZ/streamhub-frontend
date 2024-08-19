import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";

test("renders HomePage with correct links", () => {
    const { getByText } = render(
        <MemoryRouter>
            <HomePage />
        </MemoryRouter>
    );

    expect(getByText(/Home Page/i)).toBeInTheDocument();

    const seriesLink = getByText(/Series Page/i);
    expect(seriesLink).toBeInTheDocument();
    expect(seriesLink).toHaveAttribute("href", "/watch/one-piece");

    const watchLink = getByText(/Watch Page/i);
    expect(watchLink).toBeInTheDocument();
    expect(watchLink).toHaveAttribute("href", "/watch/one-piece/123");

    const watchPartyLink = getByText(/Watch Party Page/i);
    expect(watchPartyLink).toBeInTheDocument();
    expect(watchPartyLink).toHaveAttribute("href", "/watch-party/one-piece/456");

    const errorLink = getByText(/Error Page/i);
    expect(errorLink).toBeInTheDocument();
    expect(errorLink).toHaveAttribute("href", "/hahaha");
});
