import { AbsolutePositionSoldBadge } from '@/components/sell/AbsolutePositionSoldBadge';
import { SearchModel } from '@/model/catalog/SearchModel';
import { ValidatableForm } from '@/model/util/ValidatableForm';
import { currency } from '@/util/formatter';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, Button, Grid2, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

export const CatalogListPage = observer(() => {

  const searchModel = useOutletContext<SearchModel>();

  useEffect(() => {
    if (!searchModel.isSearched) {
      searchModel.search(null);
    }
  }, []);

  if (!searchModel.isSearched) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <SearchForm />
      <SearchResult />
      <More />
    </Stack>
  );
});


const SearchForm = observer(() => {
  const searchModel = useOutletContext<SearchModel>();
  const [form] = useState(new ValidatableForm());
  useEffect(() => {
    form.preset("keyword", searchModel.keyword);
  }, []);
  return (
    <Stack direction="row" justifyContent="center" spacing={1}>
      <TextField
        value={form.getValue("keyword")}
        onChange={(event) => {
          form.touch("keyword", event.target.value);
        }}
        sx={{ width: "300px" }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <Button onClick={() => {
        searchModel.search(form.getValue("keyword"));
      }}>検索</Button>
    </Stack>
  );
});

const SearchResult = observer(() => {
  const searchModel = useOutletContext<SearchModel>();
  const navigate = useNavigate();

  if (searchModel.sells.length == 0) {
    return (
      <Stack sx={{ pt: 2 }}><Typography variant='h5' textAlign="center">商品が見つかりませんでした。</Typography></Stack>
    );
  }

  return (
    <Grid2 container spacing={1}>
      {searchModel.sells.map((sell, idx) =>
        <Grid2 size={4} key={idx}
        >
          <Stack>
            <Paper elevation={0} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <Box sx={{ width: "200px", height: "200px", overflow: "hidden", borderRadius: 2, cursor: "pointer", position: "relative" }}
                onClick={() => {
                  navigate(`/catalog/detail/${sell.id}`);
                }}
              >
                <img src={`/api/catalog/sells/${sell.id}/product-images/${sell.productImageIds[0]}`} style={{ width: "400px", height: "300px", margin: "-75px 0 0 -100px", filter: sell.sold ? "grayscale(100%)" : "none" }} />

                {sell.sold && <AbsolutePositionSoldBadge width="100px" height="50px" />}
              </Box>
              <Typography color="textPrimary" textAlign="center">{sell.productName}</Typography>
              <Typography color="textSecondary" textAlign="center">{currency(sell.price)}</Typography>
            </Paper>
          </Stack>
        </Grid2>
      )}
    </Grid2>
  );
});

const More = observer(() => {
  const searchModel = useOutletContext<SearchModel>();
  if (searchModel.isLastPage == true) {
    return null;
  }
  return (
    <Box textAlign="center">
      <Button
        onClick={() => {
          searchModel.searchNext();
        }}
      >さらに表示  </Button>
    </Box>
  )
});