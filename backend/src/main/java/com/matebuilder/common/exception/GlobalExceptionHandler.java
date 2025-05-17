package com.matebuilder.common.exception;

import com.matebuilder.common.api.R;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public R<Void> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
        return R.error(400, "文件大小超过限制，最大允许10MB");
    }

    @ExceptionHandler(Exception.class)
    public R<Void> handleException(Exception e) {
        return R.error(500, "服务器内部错误：" + e.getMessage());
    }
} 