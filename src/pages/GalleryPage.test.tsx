import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ChangeEvent, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getFoldersAsync, searchFoldersAsync } from '../apis/gallery-apis';
import GalleryPage from './GalleryPage';

vi.mock('../apis/gallery-apis', () => ({
    getFoldersAsync: vi.fn(),
    searchFoldersAsync: vi.fn(),
}));

vi.mock('../components/GalleryFolder', () => ({
    default: ({ folderId }: { folderId: string }) => <div data-testid="folder">{folderId}</div>,
}));

vi.mock('../components/PageBody', () => ({
    default: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

vi.mock('../components/PageHeading', () => ({
    default: ({ heading }: { heading: string }) => <h1>{heading}</h1>,
}));

vi.mock('@mui/material/Box', () => ({
    default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@mui/material/Button', () => ({
    default: ({ children, onClick }: { children: ReactNode, onClick: () => void }) => <button onClick={onClick}>{children}</button>,
}));

vi.mock('@mui/material/CircularProgress', () => ({
    default: () => <span>Loading</span>,
}));

vi.mock('@mui/material/TextField', () => ({
    default: ({ label, onChange, onCompositionStart, onCompositionEnd, value }: {
        label: string,
        onChange: (event: ChangeEvent<HTMLInputElement>) => void,
        onCompositionStart: () => void,
        onCompositionEnd: () => void,
        value: string,
    }) => <label>{label}<input aria-label={label} onChange={onChange} onCompositionStart={onCompositionStart} onCompositionEnd={onCompositionEnd} value={value} /></label>,
}));

const getFoldersAsyncMock = vi.mocked(getFoldersAsync);
const searchFoldersAsyncMock = vi.mocked(searchFoldersAsync);

const galleryListResponse = {
    success: true,
    data: {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    },
    messages: [],
};

beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    getFoldersAsyncMock.mockResolvedValue(galleryListResponse);
    searchFoldersAsyncMock.mockResolvedValue({ success: true, data: [], messages: [] });
});

afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

const renderGalleryPage = async () => {
    render(<GalleryPage />);
    await act(async () => {
        await Promise.resolve();
    });
};

describe('GalleryPage folder search', () => {
    it('waits 300 ms before sending a search request', async () => {
        await renderGalleryPage();

        fireEvent.change(screen.getByLabelText('Search folders'), { target: { value: 'summer' } });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(299);
        });
        expect(searchFoldersAsyncMock).not.toHaveBeenCalled();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1);
        });
        expect(searchFoldersAsyncMock).toHaveBeenCalledTimes(1);
        expect(searchFoldersAsyncMock).toHaveBeenCalledWith('summer');
    });

    it('cancels the prior timer and searches only for the final input value', async () => {
        await renderGalleryPage();
        const searchBox = screen.getByLabelText('Search folders');

        fireEvent.change(searchBox, { target: { value: 'sum' } });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(200);
        });
        fireEvent.change(searchBox, { target: { value: 'summer' } });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(300);
        });
        expect(searchFoldersAsyncMock).toHaveBeenCalledTimes(1);
        expect(searchFoldersAsyncMock).toHaveBeenCalledWith('summer');
    });

    it('immediately restores the paginated folder list when the search is cleared', async () => {
        await renderGalleryPage();
        const searchBox = screen.getByLabelText('Search folders');

        fireEvent.change(searchBox, { target: { value: 'summer' } });
        fireEvent.change(searchBox, { target: { value: '' } });

        expect(getFoldersAsyncMock).toHaveBeenCalledTimes(2);
        expect(getFoldersAsyncMock).toHaveBeenLastCalledWith(1, 10);
        expect(searchFoldersAsyncMock).not.toHaveBeenCalled();
    });

    it('does not search intermediate IME values and searches the completed Vietnamese text', async () => {
        await renderGalleryPage();
        const searchBox = screen.getByLabelText('Search folders');

        fireEvent.compositionStart(searchBox);
        fireEvent.change(searchBox, { target: { value: 'a' } });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(300);
        });
        expect(searchFoldersAsyncMock).not.toHaveBeenCalled();

        fireEvent.change(searchBox, { target: { value: 'â' } });
        fireEvent.compositionEnd(searchBox);
        await act(async () => {
            await vi.advanceTimersByTimeAsync(300);
        });

        expect(searchFoldersAsyncMock).toHaveBeenCalledTimes(1);
        expect(searchFoldersAsyncMock).toHaveBeenCalledWith('â');
    });
});
