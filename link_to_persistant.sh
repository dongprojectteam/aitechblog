#!/bin/bash

# 스크립트 실행 디렉토리를 기준으로 상대 경로 설정
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BLOG_DATA_DIR="${SCRIPT_DIR}/../blog_data"

# posts 디렉토리 소프트 링크 생성 (존재하지 않는 경우)
if [ ! -L "${SCRIPT_DIR}/posts" ]; then
    ln -sf "${BLOG_DATA_DIR}/posts" "${SCRIPT_DIR}/posts"
    echo "소프트 링크 생성: posts"
else
    echo "소프트 링크 이미 존재: posts"
fi

# book-reviews 디렉토리 소프트 링크 생성 (존재하지 않는 경우)
if [ ! -L "${SCRIPT_DIR}/book-reviews" ]; then
    ln -sf "${BLOG_DATA_DIR}/book-reviews" "${SCRIPT_DIR}/book-reviews"
    echo "소프트 링크 생성: book-reviews"
else
    echo "소프트 링크 이미 존재: book-reviews"
fi

# data 디렉토리 생성 (없는 경우)
mkdir -p "${SCRIPT_DIR}/data"

# visits.json 파일에 대한 소프트 링크 생성 (존재하지 않는 경우)
if [ ! -L "${SCRIPT_DIR}/data/visits.json" ]; then
    ln -sf "${BLOG_DATA_DIR}/data/visits.json" "${SCRIPT_DIR}/data/visits.json"
    echo "소프트 링크 생성: visits.json"
else
    echo "소프트 링크 이미 존재: visits.json"
fi

# memos.json 파일에 대한 소프트 링크 생성 (존재하지 않는 경우)
if [ ! -L "${SCRIPT_DIR}/data/memos.json" ]; then
    ln -sf "${BLOG_DATA_DIR}/data/memos.json" "${SCRIPT_DIR}/data/memos.json"
    echo "소프트 링크 생성: memos.json"
else
    echo "소프트 링크 이미 존재: memos.json"
fi

# public/uploads 디렉토리 소프트 링크 생성 (존재하지 않는 경우)
mkdir -p "${SCRIPT_DIR}/public"
if [ ! -L "${SCRIPT_DIR}/public/uploads" ]; then
    ln -sf "${BLOG_DATA_DIR}/public/uploads" "${SCRIPT_DIR}/public/uploads"
    echo "소프트 링크 생성: public/uploads"
else
    echo "소프트 링크 이미 존재: public/uploads"
fi

echo "소프트 링크 생성 작업 완료."