package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/subosito/gotenv"
)

const baseURL = "http://localhost/express-api"

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func TestExpressServerUserEndpoints(t *testing.T) {
	testEmail := "testuse42@example.com"
	testPassword := "testpass123"
	testUsername := "TestUser4"
	updatedUsername := "UpdatedUser4"
	var jwtToken string
	var userID string
	err := gotenv.Load(".env")
	if err != nil {
		log.Println("Error loading .env file:", err)
	}

	var jwtSecret = os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		panic("JWT_SECRET environment variable is not set")
	}

	t.Run("Register", func(t *testing.T) {
		payload := map[string]string{
			"username": testUsername,
			"email":    testEmail,
			"password": testPassword,
		}
		body, _ := json.Marshal(payload)

		resp, err := http.Post(baseURL+"/register", "application/json", bytes.NewBuffer(body))
		assert.NoError(t, err)
		defer resp.Body.Close()

		respBody, _ := io.ReadAll(resp.Body)
		t.Log("Register response:", string(respBody))
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		var registerResp map[string]interface{}
		err = json.Unmarshal(respBody, &registerResp)
		assert.NoError(t, err)

		userObj, ok := registerResp["user"].(map[string]interface{})
		assert.True(t, ok, "user object missing in register response")

		id, ok := userObj["id"].(string)
		assert.True(t, ok, "id missing in user object")
		userID = id
	})

	t.Run("Login", func(t *testing.T) {
		payload := map[string]string{
			"email":    testEmail,
			"password": testPassword,
		}
		body, _ := json.Marshal(payload)

		resp, err := http.Post(baseURL+"/login", "application/json", bytes.NewBuffer(body))
		assert.NoError(t, err)
		defer resp.Body.Close()
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		var responseBody map[string]interface{}
		err = json.NewDecoder(resp.Body).Decode(&responseBody)
		assert.NoError(t, err)

		token, ok := responseBody["token"].(string)
		assert.True(t, ok, "JWT token missing in response")
		jwtToken = token

		claims := jwt.MapClaims{}
		_, err = jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})
		assert.NoError(t, err, "JWT token is invalid")
	})

	authHeader := func() http.Header {
		h := http.Header{}
		h.Set("Authorization", "Bearer "+jwtToken)
		return h
	}

	t.Run("UpdateUser", func(t *testing.T) {
		payload := map[string]string{
			"username": updatedUsername,
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest(http.MethodPut, fmt.Sprintf("%s/users/%s", baseURL, userID), bytes.NewBuffer(body))
		req.Header = authHeader()
		req.Header.Set("Content-Type", "application/json")

		resp, err := http.DefaultClient.Do(req)
		assert.NoError(t, err)
		defer resp.Body.Close()
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		var user User
		json.NewDecoder(resp.Body).Decode(&user)
		assert.Equal(t, updatedUsername, user.Username)
	})

	t.Run("GetUserByID", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/users/%s", baseURL, userID), nil)
		req.Header = authHeader()

		resp, err := http.DefaultClient.Do(req)
		assert.NoError(t, err)
		defer resp.Body.Close()
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		var user User
		json.NewDecoder(resp.Body).Decode(&user)
		assert.Equal(t, updatedUsername, user.Username)
	})

	t.Run("GetAllUsers", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodGet, baseURL+"/users", nil)
		req.Header = authHeader()

		resp, err := http.DefaultClient.Do(req)
		assert.NoError(t, err)
		defer resp.Body.Close()
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		body, _ := io.ReadAll(resp.Body)
		assert.Contains(t, string(body), updatedUsername)
	})

	t.Run("DeleteUser", func(t *testing.T) {
		req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("%s/users/%s", baseURL, userID), nil)
		req.Header = authHeader()

		resp, err := http.DefaultClient.Do(req)
		assert.NoError(t, err)
		defer resp.Body.Close()
		assert.Equal(t, http.StatusOK, resp.StatusCode)

		var result map[string]string
		json.NewDecoder(resp.Body).Decode(&result)
		assert.Equal(t, "User deleted", result["message"])
	})
}
