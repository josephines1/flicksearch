// search movies
function searchMovies(pageNumber = 1) {
  $.ajax({
    url: "https://www.omdbapi.com/",
    dataType: "json",
    type: "get",
    data: {
      apikey: "fc3db2b9",
      s: $("#search-keyword").val(),
      page: pageNumber,
    },
    success: function (result) {
      $(".pagination").html("");
      if (result.Response === "True") {
        let movies = result.Search;
        let moviesContent = "";

        $.each(movies, function (i, movie) {
          if (movie.Poster == "N/A") {
            movie.Poster = "img/default.jpg";
          }
          moviesContent += `
            <div class="col-md-3">
                <div class="card" style="height: 100%">
                    <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" />
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title} <span class="badge text-bg-info">${movie.Type}</span></h5>
                        <p class="card-text">${movie.Year}</p>
                        <a href="#" class="card-link see-detail" data-bs-toggle="modal" data-bs-target="#detailModal" data-imdbid="${movie.imdbID}">
                            See Detail
                        </a>
                    </div>
                </div>
            </div>
            `;
        });

        let cardsContainer =
          `
        <p class="text-center">Search result(s) for: <strong>${$(
          "#search-keyword"
        ).val()}</strong> (${result.totalResults} movie(s) found)</p>
        ` + moviesContent;

        $(".cards-container").html(cardsContainer);

        // Add Pagination
        if (result.totalResults > 10) {
          let totalPages = Math.ceil(result.totalResults / 10);
          let paginationContent = '<ul class="pagination">';
          let startPage = Math.max(1, pageNumber - 1);
          let endPage = Math.min(totalPages, pageNumber + 1);

          if (pageNumber > 1) {
            paginationContent +=
              '<li class="page-item"><a class="page-link" href="#" onclick="searchMovies(' +
              (pageNumber - 1) +
              ')">Previous</a></li>';
          }

          if (startPage > 1) {
            paginationContent +=
              '<li class="page-item"><a class="page-link" href="#" onclick="searchMovies(1)">1</a></li>';
            if (startPage > 2) {
              paginationContent +=
                '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
          }

          for (let i = startPage; i <= endPage; i++) {
            if (i === pageNumber) {
              paginationContent +=
                '<li class="page-item active"><span class="page-link">' +
                i +
                "</span></li>";
            } else {
              paginationContent +=
                '<li class="page-item"><a class="page-link" href="#" onclick="searchMovies(' +
                i +
                ')">' +
                i +
                "</a></li>";
            }
          }

          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              paginationContent +=
                '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
            paginationContent +=
              '<li class="page-item"><a class="page-link" href="#" onclick="searchMovies(' +
              totalPages +
              ')">' +
              totalPages +
              "</a></li>";
          }

          if (pageNumber < totalPages) {
            paginationContent +=
              '<li class="page-item"><a class="page-link" href="#" onclick="searchMovies(' +
              (pageNumber + 1) +
              ')">Next</a></li>';
          }

          paginationContent += "</ul>";

          $(".pagination").html(paginationContent);
        }
      } else {
        $(".cards-container").html(
          `<div class="col">
                <h4 class="text-center">${result.Error}</h4>
                </div>`
        );
      }
    },
  });
}

// Search when user click on search button
$("#search-button").on("click", function () {
  searchMovies();
});

// Search when user press enter
$("#search-keyword").on("keyup", function (e) {
  if (e.which === 13) {
    searchMovies();
  }
});

// movie detail
$(".cards-container").on("click", ".see-detail", function () {
  // Tambahkan animasi loading ke dalam modal-body
  $(".modal-body").html(
    '<p class="text-center">Loading movie information...</p>'
  );

  $.ajax({
    url: "https://www.omdbapi.com/",
    dataType: "json",
    type: "get",
    data: {
      apikey: "fc3db2b9",
      i: $(this).data("imdbid"),
    },
    success: function (result) {
      if (result.Poster == "N/A") {
        result.Poster = "img/default.jpg";
      }
      $(".modal-body").html(
        `
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-md-4">
                    <img src="${result.Poster}" alt="${result.Title}" class="img-fluid">
                </div>
                <div class="col-md-8">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><h3>${result.Title}</h3></li>
                        <li class="list-group-item">Released: ${result.Released}</li>
                        <li class="list-group-item">Genre: ${result.Genre}</li>
                        <li class="list-group-item">Rate: ${result.imdbRating} (${result.imdbVotes} Votes)</li>
                        <li class="list-group-item">Director: ${result.Director}</li>
                        <li class="list-group-item">Writer: ${result.Writer}</li>
                        <li class="list-group-item">Actors: ${result.Actors}</li>
                        <li class="list-group-item">Plot: <span class="d-block">${result.Plot}</span></li>
                    </ul>
                </div>
            </div>
        </div>
        `
      );
    },
  });
});
